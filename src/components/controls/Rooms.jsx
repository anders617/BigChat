import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, FormInput } from 'shards-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import User from '../../api/User';
import Room, { Type } from '../../api/Room';
import CreateRoom from './CreateRoom';
import { removeUserFromRoom } from '../../api/functions';
import AnimatedButton from './AnimatedButton';
import ContentEditable from 'react-contenteditable';
import FindRoom from './FindRoom';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.rooms-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

function RoomComponent({ room, me, currentRoom, setRoom, setContent, toggle }) {
    return (
        <ListGroupItem key={room.id} style={{ lineHeight: '2.5', border: '0px' }}>
            {room.name}
            <div style={{ float: 'right' }}>
                <Button
                    disabled={currentRoom && room.id === currentRoom.id}
                    onClick={() => { setRoom(room.id); setContent(null); toggle(); }}
                    style={{ marginLeft: '4px' }}
                >
                    Join
                </Button>
                <AnimatedButton
                    theme="danger"
                    onClick={() => removeUserFromRoom({ roomID: room.id, userID: me && me.id })}
                    onComplete={() => {
                        setRoom(null);
                        toggle();
                    }}
                    style={{ marginLeft: '4px' }}
                >
                    Leave
                </AnimatedButton>
            </div>
        </ListGroupItem>
    );
}

export default function Rooms({ me, currentRoom, rooms, setRoom, setContent, open, toggle }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [findRoomOpen, setFindRoomOpen] = useState(false);
    const publicFilterRef = useRef();
    const [publicFilter, setPublicFilter] = useState('Public Rooms');
    const privateFilterRef = useRef();
    const [privateFilter, setPrivateFilter] = useState('Private Rooms');

    const publicRooms = rooms
        .filter(room => room && room.type === Type.PUBLIC)
        .filter(room => publicFilter === 'Public Rooms' || room.name.toLowerCase().includes(publicFilter.toLowerCase()))
        .map(room => RoomComponent({ room, me, currentRoom, setRoom, setContent, toggle }));
    const privateRooms = rooms
        .filter(room => room && room.type === Type.PRIVATE)
        .filter(room => privateFilter === 'Private Rooms' || room.name.toLowerCase().includes(privateFilter.toLowerCase()))
        .map(room => RoomComponent({ room, me, currentRoom, setRoom, setContent, toggle }));

    return (
        <div>
            <Modal open={open} toggle={toggle}>
                <ModalHeader className="rooms-modal-header" style={{ width: '100%' }}>
                    <h4 style={{ display: 'inline-block' }}>Rooms</h4>
                    <Button
                        title="Create room"
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={() => { toggle(); setCreateOpen(true) }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button
                        title="Find room"
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={() => { toggle(); setFindRoomOpen(true) }}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </ModalHeader>
                <ModalBody style={{ height: 'calc(100vh - 130px)' }}>
                    <ListGroup style={{ height: '48%' }}>
                        <ContentEditable
                            innerRef={publicFilterRef}
                            html={publicFilter}
                            style={{ fontSize: '1.25rem', lineHeight: '1.5rem', marginBottom: '6px', fontWeight: 330, color: 'black' }}
                            onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
                            onChange={e => { setPublicFilter(e.target.value) }}
                            onClick={() => { if (publicFilter === 'Public Rooms') setPublicFilter('') }}
                            onBlur={() => { if (publicFilterRef.current.innerText === '') setPublicFilter('Public Rooms') }}
                        />
                        <div style={{ overflowY: 'scroll', maxHeight: '100%' }}>
                            {publicRooms}
                        </div>
                    </ListGroup>
                    <br />
                    <ListGroup style={{ height: '48%' }}>
                        <ContentEditable
                            innerRef={privateFilterRef}
                            html={privateFilter}
                            style={{ fontSize: '1.25rem', lineHeight: '1.5rem', marginBottom: '6px', fontWeight: 330, color: 'black' }}
                            onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
                            onChange={e => { setPrivateFilter(e.target.value) }}
                            onClick={() => { if (privateFilter === 'Private Rooms') setPrivateFilter('') }}
                            onBlur={() => { if (privateFilterRef.current.innerText === '') setPrivateFilter('Private Rooms') }}
                        />
                        <div style={{ overflowY: 'scroll', maxHeight: '100%' }}>
                            {privateRooms}
                        </div>
                    </ListGroup>
                </ModalBody>
            </Modal>
            <CreateRoom open={createOpen} toggle={() => setCreateOpen(!createOpen)} />
            <FindRoom me={me} rooms={rooms} setRoom={setRoom} open={findRoomOpen} toggle={() => setFindRoomOpen(!findRoomOpen)} />
        </div >
    );
}

Rooms.propTypes = {
    me: PropTypes.instanceOf(User),
    currentRoom: PropTypes.instanceOf(Room),
    open: PropTypes.bool.isRequired,
};

Rooms.defaultProps = {
    me: null,
    currentRoom: null,
};