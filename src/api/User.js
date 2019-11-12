/* eslint-disable no-underscore-dangle */
import db from './db';
import auth from './auth';
import {
    addFriend,
    createMe,
} from './functions'
import {
    updateArrayWithChanges
} from './utils';
import FriendRequest from './FriendRequest';

export const Status = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
};

export default class User {
    constructor({
        id,
        name,
        photoURL,
    }) {
        this._id = id;
        this._name = name;
        this._photoURL = photoURL;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get photoURL() {
        return this._photoURL;
    }
}

export function subscribeUser(consumer, userID) {
    return db.collection('users')
        .doc(userID)
        .onSnapshot(snapshot => {
            consumer(new User({
                id: snapshot.id,
                ...snapshot.data(),
            }));
        });
}

export function subscribeMe(consumer) {
    (async () => {
        const {
            exists
        } = await db.collection('users')
            .doc(auth.currentUser.uid)
            .get()
        if (!exists) {
            createMe();
        }
    })();
    return subscribeUser(consumer, auth.currentUser.uid);
}

export function subscribeRoomIDs(consumer, userID) {
    return db.collection('users')
        .doc(userID)
        .collection('rooms')
        .onSnapshot(snapshot => {
            consumer(snapshot.docs.map(doc => doc.id));
        });
}

export function subscribeFriendIDs(consumer, userID) {
    return db.collection('users')
        .doc(userID)
        .collection('friends')
        .onSnapshot(snapshot => {
            consumer(snapshot.docs.map(doc => doc.id));
        });
}

export function subscribeFriendRequests(consumer, userID) {
    const friendRequests = [];
    return db.collection('users')
        .doc(userID)
        .collection('friendRequests')
        .onSnapshot(snapshot => {
            updateArrayWithChanges(friendRequests, snapshot.docChanges());
            consumer(friendRequests.map(data => new FriendRequest(data)));
        });
}