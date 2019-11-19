const express = require('express');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');

const app = admin.initializeApp();

const checkAuth = ({
  context,
}) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
};

const checkString = ({
  str,
  msg = '',
}) => {
  if (!(typeof str === 'string') || str.length === 0) {
    throw new functions.https.HttpsError('failed-precondition', msg);
  }
}

const expandMessage = ({
  original,
  context
}) => {
  const replacements = {
    'shrug': '¯\\_(ツ)_/¯',
    'table': '(╯°□°）╯︵ ┻━┻',
    'angry': 'ಠ_ಠ',
    'energy': '༼ つ ◕_◕ ༽つ',
    'run': 'ᕕ( ᐛ )ᕗ',
    'ayyy': '(☞ﾟヮﾟ)☞',
    'ryantj': '(◕‿◕✿)',
    'uwu': ' (⁄˘⁄ ⁄ ω⁄ ⁄ ˘⁄)♡𝓤𝔀𝓤(ᵕᴗ ᵕ⁎)',
    'anders': 'A̹̙̯̣̹̹n͔̕d̹̲̯̖͍̭̼e̛͉̠̳̺̘ͅr̬̺͔̙͉̮̹s̪͈̲̖̼̜͡ ͖i̼̯̤͎͇̥s̪̦͈͉̹̙ ̤̹̻̙ͅl͓̻̞̞͍̩i̤̞̼̪ͅt͔̹̕t̷y̪̗̭̞̹',
    'me': context.auth.token.name,
  };
  replacements['help'] = 'Try the following / commands: ' + Object.keys(replacements)
    .filter((key) => replacements.hasOwnProperty(key))
    .join('\n');
  let message = original;
  for (let i = 0; i < message.length; i++) {
    if (message[i] === '/') {
      for (let j = i; j < message.length; j++) {
        if (message[j] === ' ' || j === message.length - 1) {
          if (j === message.length - 1) {
            j = j + 1;
          }
          const cmd = message.substring(i + 1, j);
          if (replacements.hasOwnProperty(cmd.toLowerCase())) {
            message = message.substring(0, i) + replacements[cmd] + message.substring(j);
            i = j + replacements[cmd].length - cmd.length - 1;
            break;
          }
        }
      }
    }
  }
  return message;
}

exports.lookupUser = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    email,
  } = data;
  checkString({
    str: email,
    msg: 'Inavlid email'
  });
  const user = await app.auth().getUserByEmail(email);
  return {
    userID: user.uid,
  };
});

// Input: {message: `string`, roomID: `string`}
exports.sendMessage = functions.https.onCall(async (data, context) => {
  checkAuth({
    context
  });
  const {
    roomID,
    message
  } = data;
  checkString({
    str: roomID,
    msg: 'Invalid room'
  });
  checkString({
    str: message,
    msg: 'Message cannot be empty'
  });
  await app.firestore()
    .collection('rooms')
    .doc(roomID)
    .collection('messages')
    .add({
      message: expandMessage({
        original: message,
        context
      }),
      userID: context.auth.uid,
      timestamp: admin.firestore.Timestamp.now(),
      photoURL: context.auth.token.picture,
    });
  return {
    success: true,
  };
});

function makeFriends({
  userID1,
  userID2
}) {
  const friendRequest1 = app.firestore()
    .collection('users')
    .doc(userID2)
    .collection('friendRequests')
    .doc(userID1);
  const friend1 = app.firestore()
    .collection('users')
    .doc(userID2)
    .collection('friends')
    .doc(userID1);
  const friendRequest2 = app.firestore()
    .collection('users')
    .doc(userID1)
    .collection('friendRequests')
    .doc(userID2);
  const friend2 = app.firestore()
    .collection('users')
    .doc(userID1)
    .collection('friends')
    .doc(userID2);
  return app.firestore()
    .batch()
    .delete(friendRequest1)
    .delete(friendRequest2)
    .set(friend1, {})
    .set(friend2, {})
    .commit();
}

exports.addFriend = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    friendID,
    message = '',
  } = data;
  const alreadyFriends = (await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .collection('friends')
    .doc(friendID)
    .get()).exists;
  if (alreadyFriends) return {
    success: true,
  };
  const hasFriendRequest = (await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .collection('friendRequests')
    .doc(friendID)
    .get()).exists;
  if (hasFriendRequest) {
    await makeFriends({
      userID1: context.auth.uid,
      userID2: friendID,
    });
  } else {
    app.firestore()
      .collection('users')
      .doc(friendID)
      .collection('friendRequests')
      .doc(context.auth.uid)
      .set({
        message,
        timestamp: admin.firestore.Timestamp.now(),
      })
  }
  return {
    success: true,
  }
});

function removeFriends(userID1, userID2) {
  const friendRequest1 = app.firestore()
    .collection('users')
    .doc(userID2)
    .collection('friendRequests')
    .doc(userID1);
  const friend1 = app.firestore()
    .collection('users')
    .doc(userID2)
    .collection('friends')
    .doc(userID1);
  const friendRequest2 = app.firestore()
    .collection('users')
    .doc(userID1)
    .collection('friendRequests')
    .doc(userID2);
  const friend2 = app.firestore()
    .collection('users')
    .doc(userID1)
    .collection('friends')
    .doc(userID2);
  return app.firestore()
    .batch()
    .delete(friendRequest1)
    .delete(friendRequest2)
    .delete(friend1)
    .delete(friend2)
    .commit();
}

exports.removeFriend = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    friendID,
  } = data;
  removeFriends(context.auth.uid, friendID);
  return {
    success: true,
  }
});

exports.createMe = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .set({
      name: context.auth.token.name,
      name_lower: context.auth.token.name.toLowerCase(),
      photoURL: context.auth.token.picture,
    }, {
      merge: true,
    });
  return {
    success: true
  }
});

exports.createRoom = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    type,
    name,
  } = data;
  checkString({
    str: name,
    msg: 'Room name cannot be empty',
  });
  if (!['PUBLIC', 'PRIVATE', 'DIRECT'].includes(type))
    throw new functions.https.HttpsError('invalid-argument', `${type} is not a valid room type`);
  const roomRef = app.firestore()
    .collection('rooms')
    .doc();
  const usersRef = roomRef
    .collection('users')
    .doc(context.auth.token.uid);
  const roomsRef = app.firestore()
    .collection('users')
    .doc(context.auth.token.uid)
    .collection('rooms')
    .doc(roomRef.id);
  await app.firestore()
    .batch()
    .set(roomRef, {
      type,
      name,
    })
    .set(roomsRef, {})
    .set(usersRef, {})
    .commit();
  return {
    success: true,
    roomID: roomRef.id,
  };
});

exports.addUserToRoom = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    roomID,
    userID,
  } = data;
  checkString({
    str: roomID,
    msg: 'Invalid room ID',
  });
  checkString({
    str: userID,
    msg: 'Invalid user ID',
  });
  try {
    app.firestore().runTransaction(async transaction => {
      const roomRef = app.firestore().collection('rooms').doc(roomID);
      const userRef = app.firestore().collection('users').doc(userID);
      const currentUserRef = app.firestore().collection('users').doc(context.auth.uid);
      const roomCurrentUserRef = roomRef.collection('users').doc(currentUserRef.id);
      const [room, user, currentUser, roomCurrentUser] = await transaction.getAll(roomRef, userRef, currentUserRef, roomCurrentUserRef);
      if (!room.exists) throw new Error(`Room does not exist ${room.id}`);
      if (!user.exists) throw new Error(`User does not exist ${user.id}`);
      if (!currentUser.exists) throw new Error(`Current user does not exist ${currentUser.id}`);
      if (room.data().type === 'DIRECT') throw new Error('Cannot add user to direct message');
      if (room.data().type === 'PRIVATE' && !roomCurrentUser.exists) throw new Error('Not authorized to add user to private room');
      const roomNewUserRef = roomRef.collection('users').doc(user.id);
      const userNewRoomRef = userRef.collection('rooms').doc(room.id)
      transaction
        .set(roomNewUserRef, {})
        .set(userNewRoomRef, {});
    });
  } catch (e) {
    console.log(e);
    throw new functions.https.HttpsError('aborted', e.message);
  }
  return {
    success: true,
  };
});

exports.updateContent = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  const {
    roomID,
    contentID,
    state,
    time,
    lastUpdated,
    sequence,
    leader,
  } = data;
  checkString({
    str: roomID,
    msg: 'Room ID is invalid',
  });
  checkString({
    str: contentID,
    msg: 'Content ID is invalid',
  });
  if (state && !['PLAYING', 'PAUSED'].includes(state)) throw new functions.https.HttpsError('invalid-argument', 'Invalid state');
  const roomRef = app.firestore().collection('rooms').doc(roomID);
  const contentRef = roomRef.collection('content').doc(contentID);
  try {
    app.firestore().runTransaction(async transaction => {
      const inRoom = (await transaction.get(roomRef.collection('users').doc(context.auth.uid))).exists;
      if (!inRoom) throw "Not in room";
      const currentContent = await transaction.get(contentRef);
      if (currentContent.data().sequence >= sequence) throw "Concurrent update";
      return transaction.update(contentRef, {
        ...state && {
          state
        },
        ...time !== null && {
          time
        },
        ...sequence && {
          sequence
        },
        ...leader && {
          leader
        },
        lastUpdated: admin.firestore.Timestamp.fromMillis(lastUpdated),
      });
    });
  } catch (e) {
    console.log(e);
    throw new functions.https.HttpsError('aborted', 'Transaction failed');
  }
});