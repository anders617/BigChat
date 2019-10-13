import React from 'react';

import Message from './Message';

export default class Messages extends React.Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const { currentUser, messages } = this.props;

    const messagesList = messages.map(message => {
      // return <li key={message.id}>{message.message}</li>;

      return (
        <div key={message.id}>
          <Message
            message={message}
            isOwnedByUser={currentUser === message.userId}
          />
          <br />
        </div>
      );
    });

    return (
      <div
        className="Messages"
        style={{  overflowY: 'scroll' }}
      >
        <br />
        {messagesList}
        <div
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}
