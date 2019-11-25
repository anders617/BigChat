// Import FirebaseAuth and firebase.
import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Fade,
} from 'shards-react';
import * as firebase from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';

import auth from '../../api/auth';
import analytics from '../../api/analytics';
import { LOGIN } from '../../api/analyticsevents';

const WAITING_FOR_LOGIN = 0;
const LOGGED_IN = 1;
const LOGGED_OUT = 2;

class AuthenticationContainer extends React.Component {
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      {
        provider: 'yahoo.com',
        providerName: 'Yahoo!',
        buttonColor: '#720e9e',
        iconUrl: 'http://www.iconarchive.com/download/i75943/martz90/circle/yahoo.ico',
        loginHintKey: 'login_hint',
      },
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
      },
    },
  };

  // The component's Local state.
  constructor(props) {
    super(props);
    this.state = {
      status: WAITING_FOR_LOGIN, // Local signed-in state.
    };
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(
      (user) => {
        this.setState({ status: user ? LOGGED_IN : LOGGED_OUT });
        if (user) {
          analytics.logEvent(LOGIN, {});
        }
      },
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const { status } = this.state;
    const { children } = this.props;
    if (status === WAITING_FOR_LOGIN) {
      return (
        <Fade className="Loading">
          <h1 style={{textAlign: 'center'}}>
            BigChat
          </h1>
          <h2 style={{textAlign: 'center'}}>
            Loading...
          </h2>
        </Fade>
      );
    }
    if (status === LOGGED_OUT) {
      return (
        <div className="Login">
          <Fade>
            <Card>
              <CardBody>
                <CardTitle style={{ textAlign: 'center', fontSize: '32pt', marginBottom: '20px' }}>BigChat</CardTitle>
                <p style={{ textAlign: 'center' }}>Please Sign In</p>
                <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
              </CardBody>
            </Card>
          </Fade>
        </div>
      );
    }
    return (
      <div className="BigChat" style={{height: '100%'}}>
        <Fade style={{height: '100%'}}>
          {children}
        </Fade>
      </div>
    );
  }
}

export default AuthenticationContainer;
