import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, FormInput, ListGroup, ListGroupItem, Button } from 'shards-react';
import Avatar from '../chat/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useUsersByName } from '../../api/hooks';
import SendFriendRequest from './SendFriendRequest';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.add-friends-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function AddFriends({ me, friendIDs, open, toggle }) {
    const [userPrefix, setUserPrefix] = useState('');
    const users = useUsersByName(userPrefix.toLowerCase());
    const [sendRequestOpen, setSendRequestOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const userComponents = users
        .filter(user => me && user.id !== me.id && !friendIDs.includes(user.id))
        .map(user => (
            <ListGroupItem key={user.id}>
                <Avatar url={user.photoURL} />
                {user.name}
                <Button
                    style={{ float: 'right' }}
                    onClick={() => { toggle(); setSendRequestOpen(true); setSelectedFriend(user); }}
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </Button>
            </ListGroupItem>
        ));

    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className="add-friends-modal-header" style={{ width: '100%' }}>
                    Add Friends
                    <FormInput
                        onChange={e => { setUserPrefix(e.target.value) }}
                        value={userPrefix}
                        placeholder="Search By Name"
                    />
                </ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {userComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
            <SendFriendRequest
                friend={selectedFriend}
                open={sendRequestOpen}
                toggle={() => setSendRequestOpen(!sendRequestOpen)}
            />
        </div>
    );
}