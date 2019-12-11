import React, { useState, useEffect } from 'react';

import { Modal, ModalBody, ModalHeader, Button, FormInput } from 'shards-react';
import { createContent } from '../../api/functions';
import AnimatedButton from './AnimatedButton';
import Call from '../../rpc/rpc';
import { State } from '../../api/Content';
import { now } from '../../api/Sync';

export default function CreateContent({ open, toggle, room, setContent }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (open)
            (async () => {
                setName(await Call('controls.title'));
            })();
    }, [open]);

    const create = async () => {
        if (!await Call('controls.valid')) throw new Error('Cannot find content on site');
        return createContent({
            roomID: room && room.id,
            state: await Call('controls.playing') ? State.PLAYING : State.PAUSED,
            time: await Call('controls.tell'),
            duration: await Call('controls.duration'),
            url: await Call('controls.url'),
            lastUpdated: await now(),
            name,
        });
    };

    const cancel = () => {
        setName('');
        toggle();
    };

    return (
        <>
            <Modal open={open} toggle={toggle}>
                <ModalHeader>
                    <h4 style={{ display: 'inline-block' }}>Create Content</h4>
                </ModalHeader>
                <ModalBody>
                    <label style={{ width: '100%' }}>
                        Content Name
                        <FormInput
                            invalid={name.length === 0}
                            placeholder="Content name must not be empty"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </label>
                    <br />
                    <br />
                    <AnimatedButton
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={create}
                        onComplete={(response) => { setContent(response.data.contentID); Call('controls.goto', response.data.url); toggle(); }}
                    >
                        Create
                    </AnimatedButton>
                    <Button
                        theme="danger"
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                </ModalBody>
            </Modal>
        </>
    );
}