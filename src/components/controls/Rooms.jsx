import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button } from 'shards-react';
import User from '../../api/User';
import Room, { findRoom } from '../../api/Room';

export default function Rooms({ user, currentRoom, changeRoom, open, toggle }) {
    const [rooms, setRooms] = useState([]);
    if (user && user.rooms) {
        Promise.all(user.rooms.map(id => findRoom({ id }))).then(setRooms);
    }
    const roomsList = rooms.filter(room => room).map(room => (
        <ListGroupItem key={room.id} style={{ lineHeight: '2.5' }}>
            {room.name}{currentRoom && room.id == currentRoom.id ? '*' : ''}
            <Button onClick={() => { changeRoom(room); toggle(); }} style={{ float: 'right' }}>Join</Button>
        </ListGroupItem>
    ))
    return (
        <div>
            <Modal open={open} toggle={toggle}>
                <ModalHeader>Rooms</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {roomsList}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    );
}

Rooms.propTypes = {
    user: PropTypes.instanceOf(User),
    open: PropTypes.bool.isRequired,
};

Rooms.defaultProps = {
    user: null,
};