import React from 'react';
import PropTypes from 'prop-types';

const avatarStyle = {
    height: 'auto',
    width: 'auto',
    maxWidth: '40px',
    maxHeight: '40px',
    borderRadius: '50%',
    float: 'left',
    marginRight: '5px'
};

export default function Avatar({ url }) {
    if (!url) return (<div />);
    return (
        <div>
            <img src={url} alt="avatar" style={avatarStyle} />
        </div>
    )
}

Avatar.propTypes = {
    url: PropTypes.string,
};

Avatar.defaultProps = {
    url: null,
}