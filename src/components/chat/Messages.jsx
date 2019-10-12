import React from 'react';

export default function Messages({ messages }) {
  const messagesList = messages.map((message, idx) => {
    return <li key={message.id}>{message.message}</li>;
  });

  return (
    <div className="Messages">
      <ul>{messagesList}</ul>
    </div>
  );
}
