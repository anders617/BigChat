import React from 'react';
import ChatRoom from './api/ChatRoom';
import ChatContainer from './components/chat/ChatContainer';

export default class App extends React.Component {
  constructor() {
    super();
    this.chatroom = new ChatRoom('www.netflix.com');
    this.state = {
      message: '',
      chatroom: '',
      messages: [],
    };
  }

  setChatRoom = (chatroom) => {
    this.chatroom.stopListening();
    this.chatroom = new ChatRoom(chatroom);
    this.setState({ messages: [] });
    this.chatroom.startListening({
      onChange: ({ messages }) => {
        this.setState({ messages });
      },
    });
  };

  render() {
    const { chatroom, message, messages } = this.state;

    return (
      <div className="App">
        <ChatContainer />
        <div>Hello World</div>
        <div>
          <div>Chatroom:</div>
          <input
            type="text"
            onChange={(e) => this.setState({ chatroom: e.target.value })}
          />
          <button type="submit" onClick={() => this.setChatRoom(chatroom)}>
            Set
          </button>
          <div>Message:</div>
          <input
            type="text"
            onChange={(e) => this.setState({ message: e.target.value })}
          />
          <button
            type="submit"
            onClick={() => this.chatroom.send({ message, userId: 'aboberg' })}
          >
            Send
          </button>
          <div>Chat Log:</div>
        </div>
        <div>
          {messages.map((msg) => (
            <div>
              <br />
              {msg.message}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
