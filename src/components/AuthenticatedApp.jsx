import React, { useState, useEffect } from 'react';
import Controls from './controls/Controls';
import ChatContainer from './chat/ChatContainer';
import { Me } from '../api/User';
import { findRoom } from '../api/Room';

export default function AuthenticatedApp() {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    useEffect(() => {
        Me().then(me => {
            setUser(me);
            me.onChange = setUser;
        })
        findRoom({ id: '68OEbNAZ0usmHWfLqu4r' }).then(r => {
            setRoom(r);
            r.onChange = setRoom;
        })
    }, []);
    const changeRoom = (newRoom) => {
        if (room) {
            room.onChange = () => { };
        }
        setRoom(newRoom);
    }
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Controls user={user} room={room} changeRoom={changeRoom} />
            <ChatContainer user={user} room={room} />
        </div>
    );
}