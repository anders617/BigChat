import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button } from 'shards-react';
import Avatar from '../chat/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserTimes, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useFriendIDs, useUsers, useFriendRequests, useRoomUserIDs } from '../../api/hooks';
import AddFriends from './AddFriends';
import { addFriend, removeFriend, addUserToRoom } from '../../api/functions';
import { Type } from '../../api/Room';
import AnimatedButton from './AnimatedButton';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.friends-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function Friends({ me, room, open, toggle }) {
    const friendIDs = useFriendIDs(me && me.id);
    const friends = useUsers(friendIDs);
    const friendRequests = useFriendRequests(me && me.id);
    const [requesterIDs, setRequesterIDs] = useState([]);
    const requesters = useUsers(requesterIDs);
    const [addFriendsOpen, setAddFriendsOpen] = useState(false);
    const roomUserIDs = useRoomUserIDs(room && room.id);

    useEffect(() => {
        setRequesterIDs(friendRequests.map(request => request.id));
    }, [friendRequests]);

    const friendRequestComponents = friendRequests.map((request, i) => {
        const requester = requesters[i];
        return (
            <ListGroupItem key={request.id}>
                <p>
                    {requester && (
                        <div>
                            <Avatar url={requester.photoURL} />
                            {requester.name}
                        </div>
                    )}
                    <Button
                        title="Reject friend request"
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={() => removeFriend({ friendID: requester.id })}
                    >
                        <FontAwesomeIcon icon={faUserTimes} />
                    </Button>
                    <Button
                        title="Accept friend request"
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={() => addFriend({ friendID: requester.id })}
                    >
                        <FontAwesomeIcon icon={faUserCheck} />
                    </Button>
                </p>
                {request.message}
            </ListGroupItem>
        )
    });

    const friendComponents = friends.filter(friend => friend).map(friend => (
        <ListGroupItem key={friend.id}>
            <Avatar url={friend.photoURL} />
            {friend.name}
            <AnimatedButton
                title="Remove friend"
                style={{ float: 'right', marginLeft: '4px' }}
                onClick={() => removeFriend({ friendID: friend.id })}
            >
                <FontAwesomeIcon icon={faUserTimes} />
            </AnimatedButton>
            <AnimatedButton
                disabled={!room || room.type === Type.DIRECT || roomUserIDs.includes(friend.id)}
                title="Invite to current room"
                style={{ float: 'right', marginLeft: '4px' }}
                onClick={() => addUserToRoom({ roomID: room.id, userID: friend.id })}
            >
                <FontAwesomeIcon icon={faEnvelope} />
            </AnimatedButton>
        </ListGroupItem>
    ));

    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className="friends-modal-header" style={{ width: '100%' }}>
                    Friends
                    <Button
                        title="Add friend"
                        onClick={() => { toggle(); setAddFriendsOpen(true) }}
                        style={{ float: 'right' }}
                    >
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