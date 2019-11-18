import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, FormInput, Button } from 'shards-react';
import { addFriend } from '../../api/functions';

export default function SendFriendRequest({ friend, open, toggle }) {
    const [message, setMessage] = useState('');

    const cancel = () => {
        setMessage('');
        toggle();
    };

    const send = () => {
        addFriend({ friendID: friend.id, message });
        setMessage('');
        toggle();
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            send();
        }
    };

    return (
        <div>
            <Modal size="lg" open={open} toggle={() => { setMessage(''); toggle(); }}>
                <ModalHeader>
                    Send friend request to {friend && friend.name}?
                </ModalHeader>
                <ModalBody>
                    <FormInput
                        onChange={e => { setMessage(e.target.value) }}
                        value={message}
                        placeholder="Include message (optional)"
                        onKeyDown={handleKeyPress}
                    />
                    <br />
                    <div style={{ float: 'right' }}>
                        <Button theme="danger" onClick={cancel}>Cancel</Button>
                        {'      '}
                        <Button onClick={send}>Send</Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}