import React, { useState, useEffect } from 'react';
import Controls from './controls/Controls';
import ChatContainer from './chat/ChatContainer';
import Call, { register } from '../rpc/rpc';
import { useRoom, useMe, useContent } from '../api/hooks';

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
    const [roomID, setRoomID] = useState(null);
    const room = useRoom(roomID);
    const me = useMe();
    const [contentID, setContentID] = useState(null);
    const content = useContent(roomID, contentID);

    useEffect(() => {
        (async () => {
            const url = await Call('controls.url');
            const kv = extractFragmentInfo(url);
            if (kv.room) setRoomID(kv.room);
            if (kv.content) setContentID(kv.content);
        })();
    }, []);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Controls me={me} room={room} content={content} setRoom={setRoomID} />
            <ChatContainer me={me} room={room} roomID={roomID} />
        </div>
    );
}