// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/auth';

import app from './app';

export default firebase.auth(app);
