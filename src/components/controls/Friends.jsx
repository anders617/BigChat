import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button } from 'shards-react';
import Avatar from '../chat/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { useFriendIDs, useUsers, useFriendRequests } from '../../api/hooks';
import AddFriends from './AddFriends';
import { addFriend, removeFriend } from '../../api/functions';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.friends-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function Friends({ me, open, toggle }) {
    const friendIDs = useFriendIDs(me && me.id);
    const friends = useUsers(friendIDs);
    const friendRequests = useFriendRequests(me && me.id);
    const [requesterIDs, setRequesterIDs] = useState([]);
    const requesters = useUsers(requesterIDs);
    const [addFriendsOpen, setAddFriendsOpen] = useState(false);

    useEffect(() => {
        setRequesterIDs(friendRequests.map(request => request.id));
    }, [friendRequests]);

    const friendRequestComponents = friendRequests.map((request, i) => (
        <ListGroupItem key={request.id}>
            <p>
                {requesters[i] && (
                    <div>
                        <Avatar url={requesters[i].photoURL} />
                        {requesters[i].name}
                    </div>
                )}
                <Button style={{ float: 'right' }} onClick={() => addFriend({ friendID: requesters[i].id })}>
                    <FontAwesomeIcon icon={faUserCheck} />
                </Button>
            </p>
            {request.message}
        </ListGroupItem>
    ));

    const friendComponents = friends.filter(friend => friend).map(friend => (
        <ListGroupItem key={friend.id}>
            <Avatar url={friend.photoURL} />
            {friend.name}
            <Button style={{ float: 'right' }} onClick={() => removeFriend({ friendID: friend.id })}>
                <FontAwesomeIcon icon={faUserTimes} />
            </Button>
        </ListGroupItem>
    ));

    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className="friends-modal-header" style={{ width: '100%' }}>
                    Friends
                    <Button onClick={() => { toggle(); setAddFriendsOpen(true) }} style={{ float: 'right' }}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </Button>
                </ModalHeader>
                <ModalBody>
                    {friendRequestComponents.length > 0 && (
                        <div>
                            <h4>Friend Requests</h4>
                            <ListGroup>
                                {friendRequestComponents}
                            </ListGroup>
                            <br />
                            <h4>Friends</h4>
                        </div>
                    )}
                    <ListGroup>
                        {friendComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
            <AddFriends me={me} friendIDs={friendIDs} open={addFriendsOpen} toggle={() => { setAddFriendsOpen(!addFriendsOpen) }} />
        </div>
    );
}