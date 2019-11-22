import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'shards-react';
import auth from '../../api/auth';
import User from '../../api/User';
import Avatar from '../chat/Avatar';

export default function UserIcon({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{display: 'inline-block'}}>
            <Dropdown open={open} toggle={() => setOpen((isOpen) => !isOpen)} inNavbar nav style={{padding: '0px', flex: '0 0 0', display: 'inline-block'}}>
                <DropdownToggle style={{padding: '0px', margin: '0px', backgroundColor: 'transparent', borderColor: 'transparent', borderRadius: '20px'}}>
                    <Avatar url={user ? user.photoURL : null} style={{marginRight: '0px'}} />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => auth.signOut()}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

UserIcon.propTypes = {
    user: PropTypes.instanceOf(User),
};

UserIcon.defaultProps = {
    user: null,
};