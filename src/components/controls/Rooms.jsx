import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button } from 'shards-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import User from '../../api/User';
import Room from '../../api/Room';
import { useRoomIDs, useRooms } from '../../api/hooks';
import CreateRoom from './CreateRoom';
import { removeUserFromRoom } from '../../api/functions';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.rooms-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function Rooms({ me, currentRoom, setRoom, open, toggle }) {
    const roomIDs = useRoomIDs(me && me.id);
    const rooms = useRooms(roomIDs);
    const [createOpen, setCreateOpen] = useState(false);

    const roomComponents = rooms.filter(room => room).map(room => (
        <ListGroupItem key={room.id} style={{ lineHeight: '2.5' }}>
            {room.name}
            <Button
                disabled={currentRoom && room.id === currentRoom.id}
                onClick={() => { setRoom(room.id); toggle(); }}
                style={{ float: 'right', marginLeft: '4px' }}
            >
                Join
            </Button>
            <Button
                theme="danger"
                onClick={() => removeUserFromRoom({ roomID: room.id, userID: me && me.id })}
                style={{ float: 'right', marginLeft: '4px' }}
            >
                Leave
            </Button>
        </ListGroupItem>
    ))
    return (
        <div>
            <Modal open={open} toggle={toggle}>
                <ModalHeader className="rooms-modal-header" style={{ width: '100%' }}>
                    Rooms
                    <Button
                        title="Create room"
                        style={{ float: 'right' }}
                        onClick={() => { toggle(); setCreateOpen(true) }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {roomComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
            <CreateRoom open={createOpen} toggle={() => setCreateOpen(!createOpen)} />
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