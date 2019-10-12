import React from 'react';

export default function Messages({ messages }) {
  const messagesList = messages.map(message => {
    return <li>{message}</li>;
  });

  return (
    <div className="Messages">
      <ul>{messagesList}</ul>
    </div>
  );
}
