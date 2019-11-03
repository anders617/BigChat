import React from 'react';
import PropTypes from 'prop-types';
import User from '../../api/User';
import Avatar from '../chat/Avatar';

export default function UserIcon({ user }) {
    return (
        <div>
            <Avatar url={user ? user.photoURL : null} />
        </div>
    );
}

UserIcon.propTypes = {
    user: PropTypes.instanceOf(User),
};

UserIcon.defaultProps = {
    user: null,
};