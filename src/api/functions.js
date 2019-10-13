// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/functions';

import app from './app';

// Input: {message: `string`, chatroom: `string`}
const sendMessage = firebase.functions().httpsCallable('sendMessage');
// Input: {otherEmail: `string`, message: `string`}
const sendDirectMessage = firebase.functions().httpsCallable('sendDirectMessage');
// Input: {email: `string`}
const lookupUser = firebase.functions().httpsCallable('lookupUser');
// Input: {}
const listDirectMessageContacts = firebase.functions().httpsCallable('listDirectMessageContacts');

export {
    sendMessage,
    sendDirectMessage,
    lookupUser,
    listDirectMessageContacts,
};
