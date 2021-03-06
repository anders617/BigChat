import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, FormInput, ListGroup, ListGroupItem } from 'shards-react';
import AnimatedButton from './AnimatedButton';
import { addUserToRoom } from '../../api/functions';
import { useRoomsByName } from '../../api/hooks';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.find-room-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function FindRoom({ me, rooms, setRoom, open, toggle }) {
    const [roomPrefix, setRoomPrefix] = useState('');
    const publicRooms = useRoomsByName(roomPrefix.toLowerCase());

    const joinRoom = async room => {
        addUserToRoom({ roomID: room.id, userID: me.id });
        setRoom(room.id);
        toggle();
    };

    const roomComponents = publicRooms
        .filter(room => room && (rooms === null || !rooms.map(r => r && r.id).includes(room.id)))
        .map(room => (
            <ListGroupItem key={room.id}>
                <div style={{ marginTop: '8px', display: 'inline-block' }}>{room.name}</div>
                <AnimatedButton
                    title="Join room"
                    style={{ float: 'right' }}
                    onClick={() => joinRoom(room)}
                >
                    Join
                </AnimatedButton>
            </ListGroupItem>
        ));

    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className="find-room-modal-header" style={{ width: '100%' }}>
                    <h4 style={{ display: 'inline-block' }}>Find Rooms</h4>
                </ModalHeader>
                <ModalBody>
                    <FormInput
                        style={{ marginBottom: '10px' }}
                        onChange={e => { setRoomPrefix(e.target.value) }}
                        value={roomPrefix}
                        placeholder="Search By Name"
                    />
                    <ListGroup>
                        {roomComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    );
}