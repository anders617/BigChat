import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { sendMessage, lookupUser, sendDirectMessage } from './functions';
import auth from './auth';
import db from './db';

const DIRECT_MESSAGE = 'DIRECT_MESSAGE';

const PUBLIC_CHAT = 'PUBLIC_CHAT';

/**
 *
 *
 * const netflix = new ChatRoom('www.netflix.com');
 * netflix.startListening({
 *   onChange: ({messages}) => console.log(messages),
 *   onNew: ({index, messages}) => console.log('Added message at ', index),
 *   onModify: ({oldIndex, newIndex, messages}) => console.log('Modified message moved from ', oldIndex, ' to ', newIndex),
 *   onRemove: ({index, messages}) => console.log('Removed message at ', index)
 * });
 * netflix.send({message: 'WOOWOWOWOWOWOWO', userId: 'aboberg'});
 *
 */
class ChatRoom {

  constructor({ chatId, type = PUBLIC_CHAT, messageLimit = 20 }) {
    this.messages = [];
    this.listening = false;
    this.unsubscribe = null;
    this.chatId = chatId;
    this.type = type;
    this.messageLimit = messageLimit;

    this.onChangeCallback = null;
    this.onNewCallback = null;
    this.onRemoveCallback = null;
    this.onModifyCallback = null;
  }

  getCollectionId() {
    return this.type === DIRECT_MESSAGE ? 'directmessages' : 'chatrooms';
  }

  async startListening({
    onChange = null, onNew = null, onRemove = null, onModify = null,
  }) {
    if (this.listening) return;
    this.listening = true;
    this.onChangeCallback = onChange;
    this.onNewCallback = onNew;
    this.onRemoveCallback = onRemove;
    this.onModifyCallback = onModify;
    let docId = this.chatId;
    if (this.type === DIRECT_MESSAGE) {
      docId = await this.getDirectMessageId();
    }
    this.unsubscribe = db.collection(this.getCollectionId())
      .doc(docId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(this.messageLimit)
      .onSnapshot(this.onSnapshot);
  }

  async getDirectMessageId() {
    const { data } = await lookupUser({ email: this.chatId });
    const otherId = data.uid;
    if (otherId < auth.currentUser.uid) {
      return `${otherId}-${auth.currentUser.uid}`;
    }
    return `${auth.currentUser.uid}-${otherId}`;
  }

  async send({ message }) {
    if (this.type === DIRECT_MESSAGE) {
      await sendDirectMessage({
        message,
        otherEmail: this.chatId,
      });
    } else {
      await sendMessage({
        message,
        chatroom: this.chatId,
      });
    }
  }

  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listening = false;
  }

  onSnapshot = (snapshot) => {
    snapshot.docChanges().forEach((change) => this.onChange(change));
  }

  onChange = (change) => {
    if (change.type === 'added') {
      const message = change.doc.data();
      message.id = change.doc.id;
      this.messages.splice(change.newIndex, 0, message);
      if (this.onNewCallback) {
        this.onNewCallback({ index: change.newIndex, messages: this.messages });
      }
    }
    if (change.type === 'modified') {
      this.messages[change.oldIndex] = change.doc.data();
      if (change.oldIndex !== change.newIndex) {
        this.messages.splice(change.oldIndex, 1);
        this.messages.splice(change.newIndex, 0, change.doc.data());
      }
      if (this.onModifyCallback) {
        this.onModifyCallback({
          oldIndex: change.oldIndex,
          newIndex: change.newIndex,
          messages: this.messages,
        });
      }
    }
    if (change.type === 'removed') {
      this.messages.splice(change.oldIndex, 1);
      if (this.onRemoveCallback) {
        this.onRemoveCallback({ index: change.oldIndex, messages: this.messages });
      }
    }
    if (this.onChangeCallback) {
      this.onChangeCallback({ messages: this.messages });
    }
  }
}

export {ChatRoom, DIRECT_MESSAGE, PUBLIC_CHAT};
