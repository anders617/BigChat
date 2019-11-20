import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, FormInput, Button } from 'shards-react';
import { addFriend } from '../../api/functions';
import AnimatedButton from './AnimatedButton';

export default function SendFriendRequest({ friend, open, toggle }) {
    const [message, setMessage] = useState('');

    const cancel = () => {
        setMessage('');
        toggle();
    };

    const send = async () => {
        setMessage('');
        return addFriend({ friendID: friend.id, message });
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
                        <Button style={{ marginLeft: '4px' }} theme="danger" onClick={cancel}>Cancel</Button>
                        <AnimatedButton
                            style={{ marginLeft: '4px' }}
                            onClick={send}
                            onComplete={toggle}
                        >
                            Send
                        </AnimatedButton>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}