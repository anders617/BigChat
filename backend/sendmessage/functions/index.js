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
  userId1,
  userId2
}) {
  const friendRequest1 = app.firestore()
    .collection('users')
    .doc(userId2)
    .collection('friendRequests')
    .doc(userId1);
  const friend1 = app.firestore()
    .collection('users')
    .doc(userId2)
    .collection('friends')
    .doc(userId1);
  const friendRequest2 = app.firestore()
    .collection('users')
    .doc(userId1)
    .collection('friendRequests')
    .doc(userId2);
  const friend2 = app.firestore()
    .collection('users')
    .doc(userId1)
    .collection('friends')
    .doc(userId2);
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
    friendId,
    message = '',
  } = data;
  const alreadyFriends = (await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .collection('friends')
    .doc(friendId)
    .get()).exists;
  if (alreadyFriends) return {
    success: true,
  };
  const hasFriendRequest = (await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .collection('friendRequests')
    .doc(friendId)
    .get()).exists;
  if (hasFriendRequest) {
    await makeFriends({
      userId1: context.auth.uid,
      userId2: friendId,
    });
  } else {
    app.firestore()
      .collection('users')
      .doc(friendId)
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

exports.createMe = functions.https.onCall(async (data, context) => {
  checkAuth({
    context,
  });
  await app.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .set({
      name: context.auth.token.name,
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
  if (!['PUBLIC', 'PRIVATE', 'DIRECT'].includes(type)) return {
    success: false,
    error: `${type} is not a valid room type`,
  };
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
})