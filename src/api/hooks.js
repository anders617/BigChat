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
    subscribeUserIDs,
    subscribeRoomNamePrefix,
} from './Room';
import {
    subscribeMe,
    subscribeRoomIDs,
    subscribeFriendIDs,
    subscribeUser,
    subscribeUserQuery,
    subscribeUserNamePrefix,
    subscribeFriendRequests
} from './User';

export function useRoom(roomID) {
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (roomID === null) {
            setRoom(null);
            return () => {};
        }
        return subscribeRoom(setRoom, roomID);
    }, [roomID]);

    return room;
}

export function useRooms(roomIDs) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        let newRooms = Array(roomIDs.length).fill(null);
        const unsubscribes = roomIDs.map((roomID, i) => subscribeRoom(room => {
            newRooms = Array.concat(newRooms.slice(0, i), room, newRooms.slice(i + 1));
            setRooms(newRooms);
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

export function useRoomUserIDs(roomID) {
    const [userIDs, setUserIDs] = useState([]);

    useEffect(() => {
        if (roomID === null) {
            setUserIDs([]);
            return () => {};
        }
        return subscribeUserIDs(setUserIDs, roomID);
    }, [roomID]);

    return userIDs;
}

export function useRoomIDs(userID) {
    const [roomIDs, setRoomIDs] = useState([]);

    useEffect(() => {
        if (!userID) {
            setRoomIDs([]);
            return () => {};
        }
        return subscribeRoomIDs(setRoomIDs, userID);
    }, [userID]);

    return roomIDs;
}

export function useMessages(roomID, messageLimit = undefined) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!roomID) {
            setMessages([]);
            return () => {};
        }
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
        if (!roomID || !contentID) {
            setContent(null);
            return () => {};
        }
        return subscribeContent(setContent, roomID, contentID);
    }, [roomID, contentID]);

    return content;
}

export function useContents(roomID) {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        if (!roomID) {
            setContents([]);
            return () => {};
        }
        return subscribeContents(setContents, roomID);
    }, [roomID]);

    return contents;
}

export function useFriendIDs(userID) {
    const [friendIDs, setFriendIDs] = useState([]);

    useEffect(() => {
        if (!userID) {
            setFriendIDs([]);
            return () => {};
        }
        return subscribeFriendIDs(setFriendIDs, userID);
    }, [userID]);

    return friendIDs;
}

export function useUsers(userIDs) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let newUsers = Array(userIDs.length).fill(null);
        const unsubscribes = userIDs.map((userID, i) => subscribeUser(user => {
            newUsers = Array.concat(newUsers.slice(0, i), user, newUsers.slice(i + 1));
            setUsers(newUsers);
            newUsers[i] = user;
        }, userID));
        setUsers(newUsers);
        return () => {
            unsubscribes.forEach(unsubscribe => {
                unsubscribe();
            });
        };
    }, [userIDs]);

    return users;
}

export function useUserQuery(filters) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        return subscribeUserQuery(setUsers, filters || []);
    }, [filters]);

    return users;
}

export function useUsersByName(prefix) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        return subscribeUserNamePrefix(setUsers, prefix);
    }, [prefix]);

    return users;
}

export function useFriendRequests(userID) {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (userID === null) {
            setFriendRequests([]);
            return () => {};
        }
        return subscribeFriendRequests(setFriendRequests, userID);
    }, [userID]);

    return friendRequests;
}

export function useRoomsByName(prefix) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        return subscribeRoomNamePrefix(setRooms, prefix);
    }, [prefix]);

    return rooms;
}