import db from './db';
import {
    sendMessage
} from './functions'

export default class Chat {
    constructor({
        id,
        snapshot,
    }) {
        this.id = id;
        this.snapshot = snapshot;
        this.onChangeFn = () => {};
        this.disconnectFn = this.snapshot.query.onSnapshot(ss => {
            this.snapshot = ss;
            this.onChangeFn(this);
        });
    }

    disconnect() {
        this.disconnectFn();
    }

    get messages() {
        return this.snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            data.id = docSnap.id;
            return data;
        });
    }

    async send({
        message,
    }) {
        await sendMessage({
            roomID: this.id,
            message,
        });
    }

    /**
     * @param {(chat: Chat) => void} fn
     */
    set onChange(fn) {
        this.onChangeFn = fn;
    }

}