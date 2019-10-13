const express = require('express');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bigchat-88c14.firebaseio.com",
});

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
  return app.firestore()
    .collection('chatrooms')
    .doc(chatroom)
    .collection('messages')
    .add({
      message: message,
      userId: email,
      timestamp: admin.firestore.Timestamp.now(),
    }).then(newdoc => {
      console.log('Success ', newdoc);
      return { success: true };
    })
    .catch(err => {
      console.log('Error', err);
      throw new functions.https.HttpsError('unknown', 'Server error', err.message);
    });
});
