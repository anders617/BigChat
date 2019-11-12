import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, Progress } from 'shards-react';
import User from '../../api/User';
import Room from '../../api/Room';
import Call from '../../rpc/rpc';
import { useContents } from '../../api/hooks';
import { State } from '../../api/Content';
import Sync from '../../api/Sync';

export default function Content({ room, me, content, open, toggle }) {
    const contents = useContents(room && room.id);
    const [sync, setSync] = useState(null);

    useEffect(() => {
        setSync(new Sync());
    }, []);

    useEffect(() => {
        if (sync) sync.synchronize(room, me, content);
    }, [room, me, content]);

    const contentComponents = contents.map(contentItem => (
        <ListGroupItem key={contentItem.id}>
            <p>
                {contentItem.url}
                <Button style={{ float: 'right' }} onClick={() => { Call('controls.goto', contentItem.url) }}>Sync</Button>
            </p>
            <Progress theme="primary" value={contentItem.time} max={contentItem.duration} animated={contentItem.state == 'PLAYING'}>{contentItem.state}</Progress>
        </ListGroupItem>
    ));
    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader>Content</ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {contentComponents}
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