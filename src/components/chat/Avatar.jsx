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

export default function Avatar({ url, style }) {
    if (!url) return (<div />);
    return (
        <div>
            <img src={url} alt="avatar" style={{...avatarStyle, ...style}} />
        </div>
    )
}

Avatar.propTypes = {
    url: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.object),
};

Avatar.defaultProps = {
    url: null,
    style: {},
}