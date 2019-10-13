const express = require('express');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bigchat-88c14.firebaseio.com",
});

const checkAuth = ({context}) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }
};

const checkString = ({str, msg = ''}) => {
  if (!(typeof str === 'string') || str.length === 0) {
    throw new functions.https.HttpsError('failed-precondition', msg);
  }
}

exports.listDirectMessageContacts = functions.https.onCall(async (data, context) => {
  checkAuth({context});
  let querySnapshot = await app.firestore()
    .collection('directmessages')
    .where('uid1', '==', context.auth.uid)
    .get();
  const contacts = []
  if (querySnapshot.size > 0) {
    querySnapshot.forEach(doc => contacts.append(doc.get('uid2')));
    return {contacts};
  }
  querySnapshot = await app.firestore()
    .collection('directmessages')
    .where('uid2', '==', context.auth.uid)
    .get();
  querySnapshot.forEach(doc => contacts.append(doc.get('uid1')));
  return {contacts};
});

exports.lookupUser = functions.https.onCall((data, context) => {
  checkAuth({context});
  const email = data.email;
  checkString({str: email, msg: 'Inavlid email'});
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
  checkAuth({context});
  const message = data.message;
  const otherEmail = data.otherEmail;
  const email = context.auth.token.email;
  checkString({str: message, msg: 'Message must be non empty string.'});
  checkString({str: otherEmail, msg: 'Email must be non empty string'});
  console.log(data);
  app.auth().getUserByEmail(otherEmail)
    .then((user) => {
      let uid1 = context.auth.uid < user.uid ? context.auth.uid : user.uid;
      let uid2 = context.auth.uid < user.uid ? user.uid : context.auth.uid;
      let chatKey = `${uid1}-${uid2}`;
      // Set uid1/uid2 for the dm collection so we can lookup later.
      app.firestore()
        .collection('directmessages')
        .doc(chatKey)
        .set({uid1, uid2});
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
  checkAuth({context});
  const message = data.message;
  const chatroom = data.chatroom;
  checkString({str: message, msg: 'Message must be non empty string.'});
  checkString({str: chatroom, msg: 'Chatroom must be non empty string.'});
  return addMessage({message, context, collectionId: 'chatrooms', docId: chatroom});
});

const expandMessage = ({original, context}) => {
  const replacements = {
    'shrug': '¯\\_(ツ)_/¯',
    'table': '(╯°□°）╯︵ ┻━┻',
    'angry': 'ಠ_ಠ',
    'energy': '༼ つ ◕_◕ ༽つ',
    'run': 'ᕕ( ᐛ )ᕗ',
    'ayyy': '(☞ﾟヮﾟ)☞',
    'ryantj': '(◕‿◕✿)',
    'anders': 'A̹̙̯̣̹̹n͔̕d̹̲̯̖͍̭̼e̛͉̠̳̺̘ͅr̬̺͔̙͉̮̹s̪͈̲̖̼̜͡ ͖i̼̯̤͎͇̥s̪̦͈͉̹̙ ̤̹̻̙ͅl͓̻̞̞͍̩i̤̞̼̪ͅt͔̹̕t̷y̪̗̭̞̹',
    'me': context.auth.token.name,
  };
  replacements['help'] = 'Try the following / commands: ' + Object.keys(replacements)
      .filter((key) => replacements.hasOwnProperty(key))
      .join('\n');
  let message = original;
  for (let i = 0;i < message.length;i++) {
    if (message[i] === '/') {
      for (let j = i;j < message.length;j++) {
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
