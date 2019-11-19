import React, { useState, useRef } from 'react';

import { Modal, ModalBody, ModalHeader, Button, FormSelect, FormInput } from 'shards-react';
import { Type } from '../../api/Room';
import { createRoom } from '../../api/functions';

export default function CreateRoom({ open, toggle }) {
    const type = useRef();
    const [name, setName] = useState('');

    const create = () => {
        toggle();
        createRoom({ type: type.current.value, name, });
    };

    const cancel = () => {
        setName('');
        toggle();
    };

    return (
        <>
            <Modal open={open} toggle={toggle}>
                <ModalHeader>Create Room</ModalHeader>
                <ModalBody>
                    <label>
                        Type
                        <FormSelect id="type" innerRef={type}>
                            <option value={Type.PRIVATE}>Private</option>
                            <option value={Type.PUBLIC}>Public</option>
                            {/* <option value={Type.DIRECT}>Direct</option> */}
                        </FormSelect>
                    </label>
                    <br />
                    <label>
                        Room Name
                        <FormInput
                            invalid={name.length === 0}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </label>
                    <br />
                    <Button
                        style={{ float: 'right', marginLeft: '4px' }}
                        onClick={create}
                    >
                        Create
                    </Button>
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