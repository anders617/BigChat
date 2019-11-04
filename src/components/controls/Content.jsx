import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, Progress } from 'shards-react';
import User from '../../api/User';
import Room from '../../api/Room';
import Call from '../../rpc/rpc';

export default function Content({ room, open, toggle }) {
    let contentList = null;
    if (room && room.content) {
        contentList = room.content.map(content => (
            <ListGroupItem key={content.id}>
                <p>
                    {content.url}
                    <Button style={{ float: 'right' }} onClick={() => { Call('controls.goto', content.url) }}>Sync</Button>
                </p>
                <Progress theme="primary" value={content.time} max={content.duration} animated={content.state == 'PLAYING'}>{content.state}</Progress>
            </ListGroupItem >
        ));
    }
    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader>Content</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {contentList}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    );
}

Content.propTypes = {
    room: PropTypes.instanceOf(Room),
    open: PropTypes.bool.isRequired,
};

Content.defaultProps = {
    room: null,
};