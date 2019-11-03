import React from 'react';
import AuthenticationContainer from './components/authentication/AuthenticationContainer';
import AuthenticatedApp from './components/AuthenticatedApp';
// Global load for Application styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

export default function App() {
  return (
    <div className="App" style={{ height: '100vh', padding: '10px', overflowY: 'hidden' }}>
      <AuthenticationContainer>
        <AuthenticatedApp />
      </AuthenticationContainer>
    </div>
  );
}
