const express = require('express');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bigchat-88c14.firebaseio.com",
});

exports.lookupUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }
  const email = data.email;
  if (!(typeof email === 'string') || email.length === 0) {
    throw new functions.https.HttpsError('failed-precondition', 'Invalid email');
  }
  console.log('Request', data);
  return app.auth().getUserByEmail(email)
    .then((user) => {
      const res = {
        uid: user.uid,
        photoUrl: user.photoURL,
        displayName: user.displayName,
      };
      console.log('Response', res);
      return res;
    }).catch(err => {
      throw new functions.https.HttpsError('unknown', err.message);
    })
});

exports.sendDirectMessage = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }
  const message = data.message;
  const otherEmail = data.otherEmail;
  const email = context.auth.token.email;
  if (!(typeof message === 'string') || message.length === 0 ||
      !(typeof otherEmail === 'string') || otherEmail.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'Invalid parameters.');
  }
  console.log(data);
  app.auth().getUserByEmail(otherEmail)
    .then((user) => {
      let chatKey = context.auth.uid;
      if (context.auth.uid < user.uid) {
        chatKey += '-' + user.uid;
      } else {
        chatKey = user.uid + '-' + chatKey;
      }
      return addMessage({message, context, collectionId: 'directmessages', docId: chatKey});
    }).catch(err => {
      throw new functions.https.HttpsError('unknown', err.message)
    });
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sendMessage = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }
  const message = data.message;
  const chatroom = data.chatroom;
  const email = context.auth.token.email;
  if (!(typeof message === 'string') || message.length === 0 ||
      !(typeof chatroom === 'string') || chatroom.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'Invalid parameters.');
  }
  return addMessage({message, context, collectionId: 'chatrooms', docId: chatroom});
});

const replacing = ({original, start, end, replacement}) => {
  result = original.substring(0, start) + replacement + original.substring(end);
  return {result, newEndIdx: j + replacement.length - cmd.length - 1};
}

const expandMessage = ({original, context}) => {
  const replacements = {
    'shrug': '¯\\_(ツ)_/¯',
    'table': '(╯°□°）╯︵ ┻━┻',
    'angry': 'ಠ_ಠ',
    'energy': '༼ つ ◕_◕ ༽つ',
    'run': 'ᕕ( ᐛ )ᕗ',
    'ayyy': '(☞ﾟヮﾟ)☞',
    'ryantj': '(◕‿◕✿)',
    'me': context.auth.token.name,
  };
  replacements['help'] = 'Try the following / commands: ' + Object.keys(replacements)
      .filter((key) => replacements.hasOwnProperty(key))
      .join('\n');
  let message = original;
  for (let i = 0;i < message.length;i++) {
    if (message[i] === '/') {
      for (let j = i;j < message.length;j++) {
        console.log(i, j, message.length - 1);
        if (message[j] === ' ' || j === message.length - 1) {
          if (j === message.length - 1) {
            j = j + 1;
          }
          const cmd = message.substring(i + 1, j);
          if (replacements.hasOwnProperty(cmd)) {
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

const addMessage = ({message, context, collectionId, docId}) => {
  return app.firestore()
  .collection(collectionId)
  .doc(docId)
  .collection('messages')
  .add({
    message: expandMessage({original: message, context}),
    userId: context.auth.token.email,
    timestamp: admin.firestore.Timestamp.now(),
    photoUrl: context.auth.token.picture,
  }).then(newdoc => {
    console.log('Success ', newdoc);
    return { success: true };
  })
  .catch(err => {
    console.log('Error', err);
    throw new functions.https.HttpsError('unknown', 'Server error', err.message);
  });
}
