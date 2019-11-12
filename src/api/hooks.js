/* eslint-disable import/prefer-default-export */
import React, {
    useState,
    useEffect
} from 'react';
import {
    subscribeRoom,
    subscribeMessages,
    subscribeContent,
    subscribeContents,
} from './Room';
import {
    subscribeMe,
    subscribeRoomIDs
} from './User';

export function useRoom(roomID) {
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (!roomID) return () => {};
        return subscribeRoom(setRoom, roomID);
    }, [roomID]);

    return room;
}

export function useRooms(roomIDs) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const newRooms = Array(roomIDs.length).fill(null);
        const unsubscribes = roomIDs.map((roomID, i) => subscribeRoom(room => {
            newRooms[i] = room;
        }, roomID));
        setRooms(newRooms);
        return () => {
            unsubscribes.forEach(unsubscribe => {
                unsubscribe();
            });
        };
    }, [roomIDs]);

    return rooms;
}

export function useRoomIDs(userID) {
    const [roomIDs, setRoomIDs] = useState([]);

    useEffect(() => {
        if (!userID) return () => {};
        return subscribeRoomIDs(setRoomIDs, userID);
    }, [userID]);

    return roomIDs;
}

export function useMessages(roomID, messageLimit = undefined) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!roomID) return () => {};
        return subscribeMessages(setMessages, roomID, messageLimit);
    }, [roomID]);

    return messages;
}

export function useMe() {
    const [me, setMe] = useState(null);

    useEffect(() => {
        return subscribeMe(setMe);
    }, []);

    return me;
}

export function useContent(roomID, contentID) {
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (!roomID || !contentID) return () => {};
        return subscribeContent(setContent, roomID, contentID);
    }, [roomID, contentID]);

    return content;
}

export function useContents(roomID) {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        if (!roomID) return () => {};
        return subscribeContents(setContents, roomID);
    }, [roomID]);

    return contents;
}