import React, { useState } from 'react';
import {
    Card,
    CardBody,
} from 'shards-react';

import auth from '../../api/auth';
import TextBar from './TextBar';
import Messages from './Messages';
import { useMessages } from '../../api/hooks';

export default function ChatContainer({ me, room, roomID }) {
    const messages = useMessages(room && room.id);
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (room) {
            room.sendMessage({ message });
            setMessage('');
        }
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className="ChatContainer" style={{ height: '80%' }}>
            <div className="Messages" style={{ height: '100%' }}>
                <div style={{ height: '100%', overflowY: 'scroll' }}>
                    <Card style={{ width: '90%', margin: 'auto', marginTop: '10px' }}>
                        {roomID ? (
                            <CardBody>
                                Now Chatting on
                                {room ? ` ${room.name}` : ' Loading...'}
                            </CardBody>
                        ) : (
                                <CardBody>
                                    Please join a room.
                            </CardBody>
                            )}
                    </Card>
                    <Messages messages={messages.slice().reverse()} me={me} />
                </div>
            </div>
            <Card>
                <TextBar
                    handleChange={e => { setMessage(e.target.value); }}
                    handleSubmit={handleSubmit}
                    handleKeyPress={handleKeyPress}
                    value={message}
                />
            </Card>
        </div>
    )
}
