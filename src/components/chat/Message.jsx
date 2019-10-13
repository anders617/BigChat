import React from 'react';

import { Card, CardBody } from 'shards-react';

const ownCardStyle = {
  minHeight: '3em',
  borderRadius: '30px',
  backgroundColor: '#0067f4',
  width: '80%',
  marginRight: '5px',
  marginLeft: 'auto',
  display: 'flex',
  boxShadow: 'none'
};

const ownBodyStyle = {
  color: '#ffffff',
  whiteSpace: 'pre-wrap',
  padding: '17px 30px',
  borderRadius: '30px',
  fontWeight: '300',
  fontSize: '14px',
  lineHeight: '1.4',
  WebkitFontSmoothing: 'subpixel-antialiased',
  wordWrap: 'break-word',
  width: '100%',
  justifyContent: 'flex-end',
};

const otherCardStyle = {
  minHeight: '3em',
  borderRadius: '30px',
  backgroundColor: '#333',
  width: '80%',
  marginRight: 'auto',
  marginLeft: '5px',
  display: 'flex',
  boxShadow: 'none'
};

const otherBodyStyle = {
  backgroundColor: '#ccc',
  whiteSpace: 'pre-wrap',
  padding: '17px 30px',
  borderRadius: '30px',
  fontWeight: '300',
  fontSize: '14px',
  lineHeight: '1.4',
  WebkitFontSmoothing: 'subpixel-antialiased',
  wordWrap: 'break-word',
  width: '100%',
  justifyContent: 'flex-end'
};

const avatarStyle = {
  height: 'auto', 
  width: 'auto', 
  maxWidth: '40px', 
  maxHeight: '40px',
  borderRadius: '50%',
  float: 'left',
  marginRight: '5px'
}

export default function Message({ message, isOwnedByUser }) {
  let messageCard = (
    <div>
      <Card style={ownCardStyle}>
        <CardBody style={ownBodyStyle}>
          {message.message}
        </CardBody>
      </Card>
    </div>
  );

  if (!isOwnedByUser) {
    messageCard = (
      <div>
        <img src={message.photoUrl} alt="avatar" style={ avatarStyle } />
        <Card style={otherCardStyle}>
          <CardBody style={otherBodyStyle}>
            {message.message}
          </CardBody>
        </Card>
      </div>
    );
  }

    return (
      <div className="Message">
       {messageCard}
      </div>
    );
}