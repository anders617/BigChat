/* eslint-disable no-underscore-dangle */

import db from './db';
import {
	createRoom as createRoomFn,
	sendMessage as sendMessageFn,
} from './functions'
import analytics from './analytics';
import {
	SEND_MESSAGE,
	CHAT_LISTEN
} from './analyticsevents';
import Content from './Content';
import Message from './Message';
import {
	updateArrayWithChanges
} from './utils';

export const Type = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	DIRECT: 'DIRECT',
};

export default class Room {
	constructor({
		id,
		name,
		type,
	}) {
		this._id = id;
		this._name = name;
		this._type = type;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	async sendMessage({
		message,
	}) {
		analytics.logEvent(SEND_MESSAGE, {
			type: this.type,
			room: this.id,
		});
		await sendMessageFn({
			roomID: this.id,
			message,
		});
	}

}

export function subscribeRoom(consumer, roomID) {
	return db.collection('rooms')
		.doc(roomID)
		.onSnapshot(snapshot => {
			consumer(new Room({
				id: snapshot.id,
				...snapshot.data(),
			}));
		});
}

export function subscribeUserIDs(consumer, roomID) {
	return db.collection('rooms')
		.doc(roomID)
		.collection('users')
		.onSnapshot(snapshot => {
			consumer(snapshot.docs.map(doc => doc.id));
		});
}

export function subscribeMessages(consumer, roomID, messageLimit = 20) {
	const messages = [];
	analytics.logEvent(CHAT_LISTEN, {
		room: roomID,
	});
	return db.collection('rooms')
		.doc(roomID)
		.collection('messages')
		.orderBy('timestamp', 'desc')
		.limit(messageLimit)
		.onSnapshot(snapshot => {
			updateArrayWithChanges(messages, snapshot.docChanges());
			consumer(messages.map(data => new Message(data)));
		});
}

export function subscribeContents(consumer, roomID) {
	const content = [];
	return db.collection('rooms')
		.doc(roomID)
		.collection('content')
		.onSnapshot(snapshot => {
			updateArrayWithChanges(content, snapshot.docChanges());
			consumer(content.map(data => new Content(data)));
		});
}

export function subscribeContent(consumer, roomID, contentID) {
	return db.collection('rooms')
		.doc(roomID)
		.collection('content')
		.doc(contentID)
		.onSnapshot(snapshot => {
			consumer(new Content({
				id: snapshot.id,
				...snapshot.data(),
			}));
		});
}

export async function createRoom({
	type,
	name,
}) {
	const response = await createRoomFn({
		type,
		name,
	});
	if (!response.data.success) return null;
	return response.data.roomID;
}