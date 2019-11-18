// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/functions';

import app from './app';

// Input: {message: `string`, roomID: `string`}
export const sendMessage = firebase.functions().httpsCallable('sendMessage');
// Input: {friendId: `string`, message: `string` }
export const addFriend = firebase.functions().httpsCallable('addFriend');
// Input: {}
export const createMe = firebase.functions().httpsCallable('createMe');
// Input: {type: `string`, name: `string`}
export const createRoom = firebase.functions().httpsCallable('createRoom');
export const updateContent = firebase.functions().httpsCallable('updateContent');
// Input {type: `string`, name: `friendID`}
export const removeFriend = firebase.functions().httpsCallable('removeFriend');