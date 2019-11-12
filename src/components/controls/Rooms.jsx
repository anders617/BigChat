import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button } from 'shards-react';
import User from '../../api/User';
import Room from '../../api/Room';
import { useRoomIDs, useRooms } from '../../api/hooks';

export default function Rooms({ me, currentRoom, setRoom, open, toggle }) {
    const roomIDs = useRoomIDs(me && me.id);
    const rooms = useRooms(roomIDs);
    const roomComponents = rooms.filter(room => room).map(room => (
        <ListGroupItem key={room.id} style={{ lineHeight: '2.5' }}>
            {room.name}
            {currentRoom && room.id === currentRoom.id ? '*' : ''}
            <Button onClick={() => { setRoom(room.id); toggle(); }} style={{ float: 'right' }}>Join</Button>
        </ListGroupItem>
    ))
    return (
        <div>
            <Modal open={open} toggle={toggle}>
                <ModalHeader>Rooms</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {roomComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
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