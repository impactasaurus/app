import * as React from 'react';
import {Auth0Error, AuthOptions, WebAuth} from 'auth0-js';
import {saveAuth} from 'helpers/auth';
import './style.less';
import {Message} from 'semantic-ui-react';
const ReactGA = require('react-ga');

const appConfig = require('../../../../config/main');

interface IProps {
  onAuthenticated?: ()=>void;
}

interface IState {
  error?: Auth0Error;
}

class Auth0Lock extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
    };
    this.parseRedirect = this.parseRedirect.bind(this);
  }

  private parseRedirect(webAuth: WebAuth, onFailure: (error: Auth0Error) => void): void {
    webAuth.parseHash((err, authResult) => {
      if (err || authResult === null || authResult === undefined) {
        onFailure(err);
        return;
      }
      saveAuth(authResult.idToken);
      if (this.props.onAuthenticated) {
        this.props.onAuthenticated();
      }
    });
  }

  public componentDidMount() {
    const options: AuthOptions = {
      domain: appConfig.app.auth.domain,
      clientID: appConfig.app.auth.clientID,
      scope: appConfig.app.auth.scope,
      responseType: 'token id_token',
      redirectUri: `${appConfig.app.root}/login`,
    };

    const webAuth = new WebAuth(options);

    this.parseRedirect(webAuth, (err: Auth0Error) => {
      if (err) {
        ReactGA.event({
          category : 'login',
          action : 'failed',
          label: err.description,
        });
        this.setState({error: err});
      } else {
        webAuth.authorize();
      }
    });
  }

  public render() {
    if (this.state.error !== undefined) {
      return (
        <Message warning>
          <Message.Header>Error {this.state.error.code}</Message.Header>
          Please try refreshing the page.
        </Message>
      );
    }
    return (
      <div />
    );
  }
}

export { Auth0Lock }
