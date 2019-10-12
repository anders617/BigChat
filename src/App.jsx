import React from 'react';
import ChatRoom from './api/ChatRoom';

export default class App extends React.Component {
  constructor() {
    super();
    this.chatroom = new ChatRoom('www.netflix.com');
    this.state = {
      message: "",
      chatroom: "",
      messages: [],
    };
  }

  setChatRoom = (chatroom) => {
    this.chatroom.stopListening();
    this.chatroom = new ChatRoom(chatroom);
    this.setState({messages: []});
    this.chatroom.startListening({
      onChange: ({messages}) => {
        this.setState({messages});
      }
    });
  }

  render() {
    return <div className="App">
      <div>Hello World</div>
      <div>
        <div>Chatroom:</div>
        <input type="text" onChange={(e) => this.setState({chatroom: e.target.value})}></input>
        <button onClick={() => this.setChatRoom(this.state.chatroom)} >Set</button>
        <div>Message:</div>
        <input type="text" onChange={(e) => this.setState({message: e.target.value})}></input>
        <button onClick={() => this.chatroom.send({message: this.state.message, userId: 'aboberg'})} >Send</button>
        <div>Chat Log:</div>
      </div>
      <div>
        {this.state.messages.map((msg) => (<div><br />{msg.message}</div>))}
      </div>
    </div>;
  }
}
