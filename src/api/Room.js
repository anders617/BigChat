// import * as firebase from 'firebase/app';
// import 'firebase/firestore';

import Chat from './Chat';
import db from './db';
import auth from './auth';
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

export const Type = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	DIRECT: 'DIRECT',
};

export default class Room {
	constructor({
		id,
		snapshot,
	}) {
		this.id = id;
		this.snapshot = snapshot;
		this.onChangeFn = () => {};
		snapshot.ref.onSnapshot(async ss => {
			this.snapshot = ss;
			this.onChangeFn(this);
		});
		// Update the room's users on snapshot
		this.usersList = null;
		this.snapshot.ref
			.collection('users')
			.onSnapshot(usersSnapsot => {
				this.usersList = usersSnapsot.docs.map(userSnap => userSnap.id);
				this.onChangeFn(this);
			}, () => {
				this.usersList = null;
				this.onChangeFn(this);
			});
		this.contentList = null;
		this.snapshot.ref
			.collection('content')
			.onSnapshot(contentSnapshot => {
				this.contentList = contentSnapshot.docs;
				this.onChangeFn(this);
			}, () => {
				this.contentList = null;
				this.onChangeFn(this);
			});
	}

	get users() {
		return this.usersList;
	}

	get name() {
		return this.snapshot.data().name;
	}

	get type() {
		return this.snapshot.data().type;
	}

	get content() {
		if (this.contentList === null) return null;
		return this.contentList.map(snapshot => new Content({
			id: snapshot.id,
			roomID: this.id,
			snapshot
		}));
	}

	async findContent({
		id
	}) {
		const snapshot = await this.snapshot.ref.collection('content').doc(id).get();
		if (!snapshot.exists) return null;
		return new Content({
			id,
			roomID: this.id,
			snapshot
		});
	}

	/**
	 * @param {(room: Room) => void} fn
	 */
	set onChange(fn) {
		this.onChangeFn = fn
	}

	/**
	 * @param {{messageLimit: number}}
	 * @returns {Promise<Chat>}
	 */
	async chat({
		messageLimit = 20,
	}) {
		analytics.logEvent(CHAT_LISTEN, {
			type: this.type,
			room: this.id,
		});
		const snapshot = await this.snapshot
			.ref
			.collection('messages')
			.orderBy('timestamp', 'desc')
			.limit(messageLimit)
			.get();
		return new Chat({
			id: this.id,
			snapshot,
		});
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

/**
 * @param {{id: string}}
 * @returns {Promise<Room>}
 */
export async function findRoom({
	id,
}) {
	if (findRoom.cache[id]) return findRoom.cache[id];
	const snapshot = await db.collection('rooms')
		.doc(id)
		.get();
	if (!snapshot.exists) return null;
	return new Room({
		id,
		snapshot,
	});
}

findRoom.cache = {};

export async function createRoom({
	type,
	name,
}) {
	const response = await createRoomFn({
		type,
		name,
	});
	if (!response.data.success) return null;
	return findRoom({
		id: response.data.roomID,
	});
}