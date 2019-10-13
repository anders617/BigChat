// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/functions';

import app from './app';

const sendMessage = firebase.functions().httpsCallable('sendMessage');

export {
    sendMessage,
};
