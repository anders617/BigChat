/* eslint-disable no-underscore-dangle */

export default class Message {
    constructor({
        id,
        message,
        photoURL,
        timestamp,
        userID,
    }) {
        this._id = id;
        this._message = message;
        this._photoURL = photoURL;
        this._timestamp = timestamp;
        this._userID = userID;
    }

    get id() {
        return this._id;
    }

    get message() {
        return this._message;
    }

    get photoURL() {
        return this._photoURL;
    }

    get timestamp() {
        return this._timestamp;
    }

    get userID() {
        return this._userID;
    }
}