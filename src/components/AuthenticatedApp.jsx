import React, { useState, useEffect } from 'react';
import Controls from './controls/Controls';
import ChatContainer from './chat/ChatContainer';
import { Me } from '../api/User';
import { findRoom } from '../api/Room';
import Call, { register } from '../rpc/rpc';

function extractFragmentInfo(url) {
    const fragment = url.split('#')[1];
    if (!fragment) return {};
    const kv = {};
    const kvPairs = fragment.split('&');
    kvPairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value && key.startsWith('BC.')) {
            kv[key.substring(3)] = value;
        }
    });
    return kv;

}

export default function AuthenticatedApp() {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [content, setContent] = useState(null);
    const changeRoom = (newRoom) => {
        if (room) room.onChange = () => { };
        setRoom(newRoom);
    }
    const changeContent = (newContent) => {
        console.log(`Registering content ${newContent}`);
        register('content', newContent);
        setContent(newContent);
    }
    useEffect(() => {
        Me().then(me => {
            setUser(me);
            me.onChange = setUser;
        })
        Call('controls.url').then(url => {
            const kv = extractFragmentInfo(url);
            if (kv.room) findRoom({ id: kv.room }).then(async newRoom => {
                changeRoom(newRoom)
                if (kv.content) {
                    const newContent = await newRoom.findContent({ id: kv.content });
                    if (newContent) {
                        changeContent(newContent);
                    }
                }
            });
        });
        // findRoom({ id: '68OEbNAZ0usmHWfLqu4r' }).then(r => {
        //     setRoom(r);
        //     r.onChange = setRoom;
        // })
    }, []);
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Controls user={user} room={room} changeRoom={changeRoom} />
            <ChatContainer user={user} room={room} />
        </div>
    );
}