import React from 'react';
import ChatContainer from './components/chat/ChatContainer';
import AuthenticationContainer from './components/authentication/AuthenticationContainer';

// Global load for Application styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

export default function App() {
  return (
    <div className="App">
      <AuthenticationContainer>
        <ChatContainer />
      </AuthenticationContainer>
    </div>
  );
}
