import React from 'react';
import {
  Card,
  CardBody,
} from 'shards-react';

import auth from '../../api/auth';
import TextBar from './TextBar';
import Messages from './Messages';


export default class ChatContainer extends React.Component {
  constructor({ room }) {
    super();
    this.state = {
      message: '',
      room,
      chat: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room != this.props.room) {
      this.changeRoom({ room: this.props.room });
    }
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { chat, message } = this.state;
    if (chat) {
      chat.send({ message });
      this.setState({ message: '' })
    }
  }

  changeRoom({ room }) {
    const { chat } = this.state;
    if (chat) chat.disconnect();
    if (!room) return;
    this.setState({ room });
    room.chat({ messageLimit: 20 }).then(newChat => {
      this.setState({ chat: newChat });
      newChat.onChange = c => this.setState({ chat: c });
    });
  }

  render() {
    const { room, chat, message } = this.state;
    return (
      <div className="ChatContainer" style={{ height: '80%' }}>
        <div className="Messages" style={{ height: '100%' }}>
          <div style={{ height: '100%', overflowY: 'scroll' }}>
            <Card style={{ width: '90%', margin: 'auto', marginTop: '10px' }}>
              <CardBody>
                Now Chatting on&nbsp;
        	    	{room ? room.name : 'Loading...'}
              </CardBody>
            </Card>
            <Messages
              messages={chat ? chat.messages.slice().reverse() : []}
              currentUser={auth.currentUser.email}
            />
          </div>
        </div>
        <Card>
          <TextBar
            handleChange={e => this.setState({ message: e.target.value })}
            handleSubmit={this.handleSubmit}
            handleKeyPress={this.handleKeyPress}
            value={message}
          />
        </Card>
      </div>
    );
  }
}
