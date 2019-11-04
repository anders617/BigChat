// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/functions';

import app from './app';

// Input: {message: `string`, roomID: `string`}
const sendMessage = firebase.functions().httpsCallable('sendMessage');
// Input: {friendId: `string`, message: `string` }
const addFriend = firebase.functions().httpsCallable('addFriend');
// Input: {}
const createMe = firebase.functions().httpsCallable('createMe');
// Input: {type: `string`, name: `string`}
const createRoom = firebase.functions().httpsCallable('createRoom');
const updateContent = firebase.functions().httpsCallable('updateContent');

export {
    sendMessage,
    addFriend,
    createMe,
    createRoom,
    updateContent,
};