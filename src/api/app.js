// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAeu9jttrDSIOA9HrBrv3QsoElQWtHBdvg',
  authDomain: 'bigchat-88c14.firebaseapp.com',
  databaseURL: 'https://bigchat-88c14.firebaseio.com',
  projectId: 'bigchat-88c14',
  storageBucket: 'bigchat-88c14.appspot.com',
  messagingSenderId: '771086944403',
  appId: '1:771086944403:web:434d2ceb2565f10cdf2566',
  measurementId: 'G-7HVG4S3150',
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
