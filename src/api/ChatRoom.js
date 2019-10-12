import * as firebase from "firebase/app";
import "firebase/firestore";

import db from './db';

/**
 * 
 *
 * const netflix = new ChatRoom('www.netflix.com');
 * netflix.startListening({
 *   onChange: (messages) => console.log(messages),
 *   onNew: ({index, messages}) => console.log('Added message at ', index),
 *   onModify: ({oldIndex, newIndex, messages}) => console.log('Modified message moved from ', oldIndex, ' to ', newIndex),
 *   onRemove: ({index, messages}) => console.log('Removed message at ', index)
 * });
 * netflix.send({message: 'WOOWOWOWOWOWOWO', userId: 'aboberg'});
 * 
 */
class ChatRoom {
    constructor(chatroom) {
        this.messages = [];
        this.listening = false;
        this.unsubscribe = null;
        this.chatroom = chatroom;

        this.onChangeCallback = null;
        this.onNewCallback = null;
        this.onRemoveCallback = null;
        this.onModifyCallback = null;
    }

    startListening({ onChange = null, onNew = null, onRemove = null, onModify = null}) {
        if (this.listening) return;
        this.listening = true;
        this.onChangeCallback = onChange; 
        this.onNewCallback = onNew;
        this.onRemoveCallback = onRemove;
        this.onModifyCallback = onModify;
        this.unsubscribe = db.collection("chatrooms")
            .doc(this.chatroom)
            .collection("messages")
            .orderBy("timestamp")
            .onSnapshot(this.onSnapshot);
    }

    send({message, userId, timestamp = null}) {
        const payload = {
            message: message, 
            timestamp: timestamp ? timestamp : firebase.firestore.Timestamp.now(), 
            userId: userId
        }
        db.collection("chatrooms")
            .doc(this.chatroom)
            .collection("messages")
            .add(payload);
    }

    stopListening() {
        this.unsubscribe();
        this.listening = false;
    }

    onSnapshot = (snapshot) => {
        snapshot.docChanges().forEach(change => this.onChange(change));
    }

    onChange = (change) => {
        if (change.type === "added") {
            console.log("New Message: ", change.doc.data().message, " At Index: ", change.newIndex);
            this.messages.splice(change.newIndex, 0, change.doc.data());
            if (this.onNewCallback) {
                this.onNewCallback({index: change.newIndex, messages: this.messages});
            }
        }
        if (change.type === "modified") {
            console.log("Modified Message: ", change.doc.data().message, " At Index: ", change.newIndex);
            this.messages[change.oldIndex] = change.doc.data()
            if (change.oldIndex !== change.newIndex) {
                this.messages.splice(change.oldIndex, 1);
                this.messages.splice(change.newIndex, 0, change.doc.data());
            }
            if (this.onModifyCallback) {
                this.onModifyCallback({oldIndex: change.oldIndex, newIndex: change.newIndex, messages: this.messages});
            }
        }
        if (change.type === "removed") {
            console.log("Removed Message: ", change.doc.data().message, " At Index: ", change.oldIndex);
            this.messages.splice(change.oldIndex, 1);
            if (this.onRemoveCallback) {
                this.onRemoveCallback({index: change.oldIndex, messages: this.messages});
            }
        }
        if (this.onChangeCallback) {
            this.onChangeCallback({messages: this.messages});
        }
        console.log("Log: ", this.messages);
    }
}

export default ChatRoom;