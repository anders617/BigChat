import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, FormInput, InputGroup, InputGroupAddon, InputGroupText } from 'shards-react';
import Avatar from '../chat/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserTimes, faEnvelope, faSearch, faComment } from '@fortawesome/free-solid-svg-icons';
import { useFriendIDs, useUsers, useFriendRequests, useRoomUserIDs } from '../../api/hooks';
import AddFriends from './AddFriends';
import { addFriend, removeFriend, addUserToRoom, createRoom } from '../../api/functions';
import { Type } from '../../api/Room';
import AnimatedButton from './AnimatedButton';
import FriendRequest from '../../api/FriendRequest';
import User from '../../api/User';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.friends-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

function FriendRequestComponent({ request, requester }) {
    return (
        <ListGroupItem key={request.id}>
            <div style={{ marginBottom: '20px' }}>
                <Avatar url={requester.photoURL} />
                <div style={{ marginTop: '8px', display: 'inline-block' }}>{requester.name}</div>
                <AnimatedButton
                    title="Reject friend request"
                    theme="danger"
                    style={{ float: 'right', marginLeft: '4px', marginTop: '3px' }}
                    onClick={() => removeFriend({ friendID: requester.id })}
                >
                    <FontAwesomeIcon icon={faUserTimes} />
                </AnimatedButton>
                <AnimatedButton
                    title="Accept friend request"
                    style={{ float: 'right', marginLeft: '4px', marginTop: '3px' }}
                    onClick={() => addFriend({ friendID: requester.id })}
                >
                    <FontAwesomeIcon icon={faUserCheck} />
                </AnimatedButton>
            </div>
            <hr style={{ marginBottom: '0.5rem' }} />
            <div>{request.message}</div>
        </ListGroupItem>
    );
}

function FriendComponent({ friend, joinDirectMessage, room, roomUserIDs }) {
    return (
        <ListGroupItem key={friend.id}>
            <Avatar url={friend.photoURL} />
            <div style={{ marginTop: '8px', display: 'inline-block' }}>{friend.name}</div>
            <div style={{ display: 'inline-flex', float: 'right' }}>
                {room && [Type.PRIVATE, Type.PUBLIC].includes(room.type) && (
                    <AnimatedButton
                        disabled={!room || room.type === Type.DIRECT || roomUserIDs.includes(friend.id)}
                        title="Invite to current room"
                        style={{ marginLeft: '4px', marginTop: '2px' }}
                        onClick={() => addUserToRoom({ roomID: room.id, userID: friend.id })}
                    >
                        <FontAwesomeIcon icon={faEnvelope} />
                    </AnimatedButton>
                )}
                <AnimatedButton
                    disabled={room && room.type === Type.DIRECT && roomUserIDs.includes(friend.id)}
                    title="Direct Message"
                    style={{ marginLeft: '4px', marginTop: '2px' }}
                    onClick={() => joinDirectMessage(friend)}
                >
                    <FontAwesomeIcon icon={faComment} />
                </AnimatedButton>
                <AnimatedButton
                    title="Remove friend"
                    theme="danger"
                    style={{ marginLeft: '4px', marginTop: '2px' }}
                    onClick={() => removeFriend({ friendID: friend.id })}
                >
                    <FontAwesomeIcon icon={faUserTimes} />
                </AnimatedButton>
            </div>
        </ListGroupItem>
    );
}

export default function Friends({ me, room, rooms, setRoom, open, toggle }) {
    const friendIDs = useFriendIDs(me && me.id);
    const friends = useUsers(friendIDs);
    const [friendsFilter, setFriendsFilter] = useState('');
    const friendRequests = useFriendRequests(me && me.id);
    const [requesterIDs, setRequesterIDs] = useState([]);
    const requesters = useUsers(requesterIDs);
    const [addFriendsOpen, setAddFriendsOpen] = useState(false);
    const roomUserIDs = useRoomUserIDs(room && room.id);

    useEffect(() => {
        setRequesterIDs(friendRequests.map(request => request.id));
    }, [friendRequests]);

    const joinDirectMessage = async friend => {
        let foundRoom = false;
        rooms
            .filter(availRoom => availRoom && availRoom.type === Type.DIRECT)
            .filter(availRoom => availRoom.id === [me.id, friend.id].sort().join('-'))
            .forEach(availRoom => {
                setRoom(availRoom.id);
                foundRoom = true;
            });
        if (!foundRoom) {
            const response = await createRoom({
                type: Type.DIRECT,
                name: [me.name, friend.name].sort().join(' and '),
                friendID: friend.id,
            });
            setRoom(response.data.roomID);
        }
        toggle();
    };

    const friendRequestComponents = friendRequests
        .map((request, i) => ({ request, requester: requesters[i] }))
        .filter(({ request, requester }) => request && requester)
        .map(({ request, requester }) => FriendRequestComponent({ request, requester }));

    const friendComponents = friends
        .filter(friend => friend && friend.name.toLowerCase().includes(friendsFilter.toLowerCase()))
        .map(friend => FriendComponent({ friend, joinDirectMessage, room, roomUserIDs }));

    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className="friends-modal-header" style={{ width: '100%' }}>
                    <h4 style={{ display: 'inline-block' }}>Friends</h4>
                    <Button
                        title="Add friend"
                        onClick={() => { toggle(); setAddFriendsOpen(true) }}
                        style={{ float: 'right' }}
                    >
                        <FontAwesomeIcon icon={faUserPlus} />
                    </Button>
                </ModalHeader>
                <ModalBody style={{ maxHeight: 'calc(100vh - 130px)', overflow: 'scroll' }}>
                    {friendRequestComponents.length > 0 && (
                        <div>
                            <h5>Friend Requests</h5>
                            <ListGroup>
                                {friendRequestComponents}
                            </ListGroup>
                            <br />
                            <h5>Friends</h5>
                        </div>
                    )}
                    <InputGroup seamless style={{ marginTop: '6px', marginBottom: '10px' }}>
                        <InputGroupAddon type="prepend">
                            <InputGroupText><FontAwesomeIcon icon={faSearch} /></InputGroupText>
                        </InputGroupAddon>
                        <FormInput type="search" onChange={e => setFriendsFilter(e.target.value)} />
                    </InputGroup>
                    <ListGroup>
                        {friendComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
            <AddFriends me={me} friendIDs={friendIDs} open={addFriendsOpen} toggle={() => { setAddFriendsOpen(!addFriendsOpen) }} />
        </div>
    );
}