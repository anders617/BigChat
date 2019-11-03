/* eslint-disable class-methods-use-this */
import db from './db';
import auth from './auth';
import {
    addFriend,
    createMe,
} from './functions'

export const Status = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
};

export default class User {
    constructor({
        id,
        snapshot = null,
    }) {
        this.id = id;
        this.snapshot = snapshot;
        this.onChangeFn = () => {};
        // Set status when online/offline
        if (this.id === auth.currentUser.uid) {
            db.collection('statuses').doc(this.id).set({
                status: Status.ONLINE,
            });
            window.onbeforeunload = () => {
                db.collection('statuses').doc(this.id).set({
                    status: Status.OFFLINE,
                });
            }
        }
        // Update state on snapshot
        snapshot.ref.onSnapshot(ss => {
            this.snapshot = ss;
            this.onChangeFn(this);
        });
        // Update friend requests on snapshot
        this.friendRequestsList = null;
        this.snapshot.ref
            .collection('friendRequests')
            .onSnapshot(async friendSnapshot => {
                this.friendRequestsList = await Promise.all(
                    friendSnapshot.docs.map(docSnap => {
                        const data = docSnap.data();
                        // eslint-disable-next-line no-use-before-define
                        data.user = findUser({
                            id: docSnap.id
                        });
                        return data;
                    }));
                this.onChangeFn(this);
            }, () => {
                this.friendRequestsList = null;
                this.onChangeFn(this);
            });
        // Update friends on snapshot
        this.friendsList = null;
        this.snapshot.ref
            .collection('friends')
            .onSnapshot(async friendsSnapshot => {
                this.friendsList = await Promise.all(
                    // eslint-disable-next-line no-use-before-define
                    friendsSnapshot.docs.map(docSnap => findUser({
                        id: docSnap.id
                    })));
                this.onChangeFn(this);
            }, () => {
                this.friendsList = null;
                this.onChangeFn(this);
            });
        // Update the rooms the user is a member of on snapshot
        this.roomsList = null;
        this.snapshot.ref
            .collection('rooms')
            .onSnapshot(roomsSnapshot => {
                this.roomsList = roomsSnapshot.docs.map(roomSnap => roomSnap.id);
                this.onChangeFn(this);
            }, () => {
                this.roomsList = null;
                this.onChangeFn(this);
            });
    }

    /**
     * @returns {string}
     */
    get name() {
        return this.snapshot.data().name;
    }

    /**
     * @returns {string}
     */
    get photoURL() {
        return this.snapshot.data().photoURL;
    }

    /**
     * @returns {User[]}
     */
    get friends() {
        return this.friendsList;
    }

    get rooms() {
        return this.roomsList;
    }

    async addFriend({
        user,
        message = '',
    }) {
        await addFriend({
            friendId: user.id,
            message,
        });
    }

    get friendRequests() {
        return this.friendRequestsList;
    }

    /**
     * @param {(user: User) => void} fn
     */
    set onChange(fn) {
        this.onChangeFn = fn
    }

}

/**
 * @param {{id: string}}
 * @returns {Promise<User>}
 */
export async function findUser({
    id,
}) {
    if (findUser.cache[id]) return findUser.cache[id];
    try {
        const userSnapshot = await db.collection('users')
            .doc(id)
            .get();
        if (!userSnapshot.exists) return null;
        const user = new User({
            id,
            snapshot: userSnapshot,
        });
        findUser.cache[id] = user;
        return user;
    } catch (error) {
        return null;
    }

}

findUser.cache = {};

/**
 * @returns {Promise<User>}
 */
export async function Me() {
    if (!auth.currentUser.uid) return null;
    let user = await findUser({
        id: auth.currentUser.uid,
    });
    if (!user) {
        await createMe();
        user = await findUser({
            id: auth.currentUser.uid,
        });
    }
    return user;
}