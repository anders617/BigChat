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
// Input: {type: `string`, name: `string`, url: `string` (optional)}
export const createRoom = firebase.functions().httpsCallable('createRoom');
export const updateContent = firebase.functions().httpsCallable('updateContent');
// Input {friendID: `string`}
export const removeFriend = firebase.functions().httpsCallable('removeFriend');
// Input {roomID: `string`, userID: `string`}
export const addUserToRoom = firebase.functions().httpsCallable('addUserToRoom');
// Input {roomID: `string`, userID: `string`}
export const removeUserFromRoom = firebase.functions().httpsCallable('removeUserFromRoom');
// Input {roomID: `string`, state: `string`, time: `number`, duration: `number`, url: `string`, lastUpdated: `date`, name: `string`}
export const createContent = firebase.functions().httpsCallable('createContent');
// Input {roomID: `string`, contentID: `string`}
export const deleteContent = firebase.functions().httpsCallable('deleteContent');