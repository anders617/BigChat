import React from 'react';
import { Card, CardBody } from 'shards-react';

import auth from '../../api/auth';
import { ChatRoom, PUBLIC_CHAT } from '../../api/ChatRoom';
import TextBar from './TextBar';
import Messages from './Messages';


export default class ChatContainer extends React.Component {
  constructor() {
    super();
    this.chatroom = new ChatRoom({chatId: 'www.netflix.com', type: PUBLIC_CHAT});
    this.state = {
      message: '',
      chatroom: 'www.netflix.com',
      messages: []
    };
  }

  componentDidMount() {
    this.setChatRoom('www.netflix.com');
  }

  setChatRoom(chatroom) {
    this.chatroom.stopListening();
    this.chatroom = new ChatRoom({chatId: chatroom, type: PUBLIC_CHAT});
    this.setState({ messages: [] });
    this.chatroom.startListening({
      onChange: ({ messages }) => {
        this.setState({ messages });
      }
    });
  }

  handleKeyPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const {message} = this.state

    this.chatroom.send({ message, userId: auth.currentUser.email })
    this.setState({message:''})
  }

  render() {
    const { chatroom, message, messages } = this.state;

    return (
      <div className="ChatContainer">
        <Card>
          <CardBody>
            Now Chatting on&nbsp;
            {chatroom}
          </CardBody>
        </Card>
        <Messages messages={messages.slice().reverse()} currentUser={auth.currentUser.email} />
        <TextBar
          handleChange={e => this.setState({ message: e.target.value })}
          handleSubmit={this.handleSubmit}
          handleKeyPress={this.handleKeyPress}
          value={message}
        />
      </div>
    );
  }
}
