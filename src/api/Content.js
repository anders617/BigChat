/* eslint-disable no-underscore-dangle */
export const State = {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
}

export default class Content {
    constructor({
        id,
        state,
        time,
        duration,
        url,
        lastUpdated,
        leader,
        sequence,
        name,
    }) {
        this._id = id;
        this._state = state;
        this._time = time;
        this._duration = duration;
        this._url = url;
        this._lastUpdated = lastUpdated;
        this._leader = leader;
        this._sequence = sequence;
        this._name = name;
    }

    get id() {
        return this._id;
    }

    get state() {
        return this._state;
    }

    get time() {
        return this._time;
    }

    get duration() {
        return this._duration;
    }

    get url() {
        return this._url;
    }

    get lastUpdated() {
        return this._lastUpdated;
    }

    get leader() {
        return this._leader;
    }

    get sequence() {
        return this._sequence;
    }

    get name() {
        return this._name;
    }

}