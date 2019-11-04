/* eslint-disable class-methods-use-this */
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
    updateContent,
} from './functions';
import Call from '../rpc/rpc';


export const State = {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
}

export default class Content {
    constructor({
        id,
        roomID,
        snapshot,
    }) {
        this.id = id;
        this.roomID = roomID;
        this.snapshot = snapshot;
        this.sequence = 0;
        this.onChangeFn = () => {};
        this.snapshot.ref.onSnapshot(ss => {
            this.snapshot = ss;
            this.synchronize();
            this.onChangeFn(this);
        });
    }

    async synchronize() {
        if (this.snapshot.data().sequence <= this.sequence) {
            return;
        }
        this.sequence = this.snapshot.data().sequence;
        console.log(`STATE: ${this.state}, PLAYING: ${await Call('controls.playing')} PAUSED: ${await Call('controls.paused')}`);
        if (this.state === State.PLAYING && !await Call('controls.playing')) {
            await Call('controls.play');
        }
        if (this.state === State.PAUSED && !await Call('controls.paused')) {
            await Call('controls.pause');
        }
        const time = await Call('controls.tell');
        let desiredTime;
        if (this.state === State.PAUSED) desiredTime = this.time;
        else desiredTime = this.time + (Date.now() - this.lastUpdated.toDate()) / 1000;
        if (Math.abs(time - desiredTime) > 5) {
            await Call('controls.seek', desiredTime);
        }
    }

    get state() {
        return this.snapshot.data().state;
    }

    set state(newState) {
        this.sequence = this.sequence + 1;
        (async () => {
            updateContent({
                contentID: this.id,
                roomID: this.roomID,
                lastUpdated: firebase.firestore.Timestamp.now(),
                state: newState,
                time: await Call('controls.tell'),
                sequence: this.sequence,
            });
        })();

    }

    get time() {
        return this.snapshot.data().time;
    }

    set time(newTime) {
        this.sequence = this.sequence + 1;
        let specifiedTime;
        if (this.state === State.PAUSED) specifiedTime = this.time;
        else specifiedTime = this.time + (Date.now() - this.lastUpdated.toDate()) / 1000;
        if (Math.abs(specifiedTime - newTime) < 5) return;
        (async () => {
            updateContent({
                contentID: this.id,
                roomID: this.roomID,
                lastUpdated: firebase.firestore.Timestamp.now(),
                time: newTime,
                sequence: this.sequence,
            })
        })();
    }

    get duration() {
        return this.snapshot.data().duration;
    }

    get url() {
        return this.snapshot.data().url;
    }

    get lastUpdated() {
        return this.snapshot.data().lastUpdated;
    }

    play() {
        console.log(`content.play`);
        if (this.state !== State.PLAYING) {
            this.state = State.PLAYING;
        }
    }

    pause() {
        console.log(`content.pause`);
        if (this.state !== State.PAUSED) {
            this.state = State.PAUSED;
        }
    }

    seek(time) {
        console.log(`content.seek ${time}`);
        this.time = time;
    }
}