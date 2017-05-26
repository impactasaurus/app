const appConfig = require('../../../../config/main');

import * as React from 'react';
import auth0Lock from 'auth0-lock';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {saveAuth} from 'modules/auth';
const { connect } = require('react-redux');

interface IProps {
  setURL: Redux.ActionCreator<any>;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Login extends React.Component<IProps, {}> {

  private container: HTMLDivElement;
  private lock: Auth0LockStatic;

  constructor(props) {
    super(props);
    this.bindContainer = this.bindContainer.bind(this);
  }

  public componentWillUnmount() {
    this.lock.hide();
  }

  public componentDidMount() {
    this.lock = new auth0Lock(appConfig.app.auth.clientID, appConfig.app.auth.domain, {
      autofocus: true,
      container: this.container.id,
      allowSignUp: false,
      auth: {
        params: {
          scope: appConfig.app.auth.scope,
        },
      },
    });
    this.lock.show();
    this.lock.on('authenticated', (authResult: auth0.Auth0DecodedHash) => {
      this.lock.getUserInfo(authResult.accessToken, (err: auth0.Auth0Error, profile: auth0.Auth0UserProfile) => {
        if (err) {
          console.error(err);
          return;
        }

        saveAuth(authResult, profile);
        this.props.setURL('');
      });
    });
  }

  private bindContainer(node: HTMLDivElement) {
    this.container = node;
  }

  public render() {
    return (
      <div id="auth0-lock-container" ref={this.bindContainer} />
    );
  }
}

export { Login }
