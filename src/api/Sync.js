import Call, {
    register
} from "../rpc/rpc";
import {
    State
} from "./Content";
import {
    updateContent
} from "./functions";

async function now() {
    if (now.offset === -1) {
        const clientTimestamp = Date.now();
        const resp = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
            method: 'GET',
        });
        const responseTimestamp = Date.now();
        const serverTimestamp = Date.parse((await resp.json()).utc_datetime);
        const adjustedTimestamp = serverTimestamp + (responseTimestamp - clientTimestamp) / 2;
        const offset = adjustedTimestamp - responseTimestamp;
        now.offset = offset;
    }
    return Date.now() + now.offset;
}
now.offset = -1;

export default class Sync {
    constructor() {
        this.sequence = 0;
        this.content = null;
    }

    async play() {
        if (!this.content || !this.room || !this.me || this.content.state === State.PLAYING) return;
        console.log('Sending play command');
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: await now(),
            state: State.PLAYING,
            time: await Call('controls.tell'),
            sequence: sequence + 1,
            leader: this.me.id,
        });
        if (this.sequence === sequence) {
            this.sequence += 1;
        }
    }

    async pause() {
        if (!this.content || !this.room || !this.me || this.content.state === State.PAUSED) return;
        console.log('Sending pause command');
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: await now(),
            state: State.PAUSED,
            time: await Call('controls.tell'),
            sequence: sequence + 1,
            leader: this.me.id,
        });
        if (this.sequence === sequence) {
            this.sequence += 1;
        }
    }

    async seek(time) {
        if (!this.content || !this.room || !this.me) return;
        const expectedTime = this.content.state === State.PAUSED ?
            this.content.time :
            this.content.time + ((await now()) - this.content.lastUpdated.toDate()) / 1000;
        const state = await Call('controls.playing') ? State.PLAYING : State.PAUSED;
        if (Math.abs(expectedTime - time) < 1 && state === this.content.state) return;
        console.log('Sending seek command');
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: await now(),
            state,
            time,
            sequence: sequence + 1,
            leader: this.me.id,
        });
        if (this.sequence === sequence) {
            this.sequence += 1;
        }
    }

    async synchronize(room, me, content) {
        if (!room || !me || !content) return;
        this.content = content;
        if (content.sequence <= this.sequence) return;
        this.sequence = content.sequence;
        this.room = room;
        this.me = me;
        register('sync', this);
        if (content.state === State.PAUSED && !await Call('controls.paused')) {
            console.log('Received pause command');
            await Call('controls.pause');
        }
        if (content.state === State.PLAYING && !await Call('controls.playing')) {
            console.log('Received play command');
            await Call('controls.play');
        }
        const time = await Call('controls.tell');
        const desiredTime = content.state === State.PAUSED ?
            content.time :
            content.time + ((await now()) - content.lastUpdated.toDate()) / 1000;
        if (Math.abs(time - desiredTime) >= 1) {
            console.log('Received seek command');
            await Call('controls.seek', desiredTime);
        }
    }
}