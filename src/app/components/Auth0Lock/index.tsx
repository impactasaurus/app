import * as React from 'react';
import {Auth0Error, WebAuth} from 'auth0-js';
import {saveAuth, getWebAuth} from 'helpers/auth';
import './style.less';
import {Message} from 'semantic-ui-react';
const ReactGA = require('react-ga');

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
    const webAuth = getWebAuth();

    this.parseRedirect(webAuth, (err: Auth0Error) => {
      if (err) {
        ReactGA.event({
          category : 'login',
          action : 'failed',
          label: err.errorDescription,
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
        <Message error={true}>
          <Message.Header>Failed to login</Message.Header>
          <Message.Content>{this.state.error.errorDescription}</Message.Content>
        </Message>
      );
    }
    return <div>Redirecting to login...</div>;
  }
}

export { Auth0Lock };
