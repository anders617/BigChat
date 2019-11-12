import Call, {
    register
} from "../rpc/rpc";
import {
    State
} from "./Content";
import {
    updateContent
} from "./functions";

export default class Sync {
    constructor() {
        this.sequence = 0;
        this.content = null;
    }

    async play() {
        if (!this.content || !this.room || !this.me || this.content.state === State.PLAYING) return;
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: Date.now(),
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
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: Date.now(),
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
            this.content.time + (Date.now() - this.content.lastUpdated.toDate()) / 1000;
        const state = await Call('controls.playing') ? State.PLAYING : State.PAUSED;
        if (Math.abs(expectedTime - time) < 1 && state === this.content.state) return;
        const {
            sequence
        } = this;
        await updateContent({
            roomID: this.room.id,
            contentID: this.content.id,
            lastUpdated: Date.now(),
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
            await Call('controls.pause');
        }
        if (content.state === State.PLAYING && !await Call('controls.playing')) {
            await Call('controls.play');
        }
        const time = await Call('controls.tell');
        const desiredTime = content.state === State.PAUSED ?
            content.time :
            content.time + (Date.now() - content.lastUpdated.toDate()) / 1000;
        if (Math.abs(time - desiredTime) >= 1) {
            await Call('controls.seek', desiredTime);
        }
    }
}