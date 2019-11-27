import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, Progress } from 'shards-react';
import User from '../../api/User';
import Room from '../../api/Room';
import Call from '../../rpc/rpc';
import { useContents } from '../../api/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { State } from '../../api/Content';
import Sync from '../../api/Sync';
import CreateContent from './CreateContent';
import AnimatedButton from './AnimatedButton';
import { deleteContent } from '../../api/functions';

const sheet = window.document.styleSheets[0];
sheet.insertRule('.content-modal-header .modal-title { width: 100%; }', sheet.cssRules.length);

export default function Content({ room, me, content, setContent, open, toggle }) {
    const contents = useContents(room && room.id);
    const [sync, setSync] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        setSync(new Sync());
    }, []);

    useEffect(() => {
        if (sync) sync.synchronize(room, me, content);
    }, [room, me, content]);

    const contentComponents = contents.map(contentItem => (
        <ListGroupItem key={contentItem.id}>
            <p>
                {contentItem.name}
            </p>
            <Progress
                theme="primary"
                value={contentItem.time}
                max={contentItem.duration}
                animated={contentItem.state === 'PLAYING'}
            >
                {contentItem.state}
            </Progress>
            <br />
            <Button
                disabled={content && content.id === contentItem.id}
                style={{ float: 'right', marginLeft: '4px' }}
                onClick={() => { Call('controls.goto', contentItem.url) }}
            >
                Sync
            </Button>
            <AnimatedButton
                theme='danger'
                style={{ float: 'right', marginLeft: '4px' }}
                onClick={() => {
                    setContent(null);
                    return deleteContent({ roomID: room && room.id, contentID: contentItem.id })
                }}
            >
                <FontAwesomeIcon icon={faTrash} />
            </AnimatedButton>
        </ListGroupItem>
    ));
    return (
        <div>
            <Modal size="lg" open={open} toggle={toggle}>
                <ModalHeader className='content-modal-header' style={{ width: '100%' }}>
                    Content
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
                        {contentComponents}
                    </ListGroup>
                </ModalBody>
            </Modal>
            <CreateContent open={createOpen} toggle={() => setCreateOpen(!createOpen)} room={room} setContent={setContent} />
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