import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Button, Message } from 'semantic-ui-react';
import {getUserEmail, getWebAuth} from '../../helpers/auth';
import {UserSettings} from 'components/UserSettings';
const config = require('../../../../config/main').app.auth;

const ReactGA = require('react-ga');
const buttonText = 'Click here to change your password';

interface IState {
  changePasswordError: string|null;
  changePasswordLoading: boolean;
  changePasswordTriggered: boolean;
}

class Account extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {
      changePasswordError: null,
      changePasswordLoading: false,
      changePasswordTriggered: false,
    };
    this.startChangePassword = this.startChangePassword.bind(this);
    this.renderChangePassword = this.renderChangePassword.bind(this);
  }

  private startChangePassword() {
    this.setState({
      ...this.state,
      changePasswordTriggered: true,
    });

    const email = getUserEmail();
    if (email === null) {
      return this.setState({
        ...this.state,
        changePasswordError: 'Failed to gather your email address, please try refreshing the page',
        changePasswordTriggered: true,
      });
    }

    this.setState({
      ...this.state,
      changePasswordLoading: true,
    });
    getWebAuth().changePassword({
      connection: config.connection,
      email,
    }, (err) => {
      if (err) {
        this.setState({
          ...this.state,
          changePasswordLoading: false,
          changePasswordError: 'Failed to trigger password reset, please try refreshing the page',
          changePasswordTriggered: true,
        });
        ReactGA.event({
          category : 'password_reset',
          action : 'failed',
          label: err.description,
        });
      } else {
        this.setState({
          ...this.state,
          changePasswordLoading: false,
          changePasswordError: null,
          changePasswordTriggered: true,
        });
        ReactGA.event({
          category : 'password_reset',
          action : 'success',
        });
      }
    });
  }

  private renderChangePassword() {
    if (this.state.changePasswordTriggered === false || this.state.changePasswordLoading === true) {
      return (
        <Button key="security-loading" loading={this.state.changePasswordLoading} onClick={this.startChangePassword}>{buttonText}</Button>
      );
    }
    if (this.state.changePasswordError === null) {
      return (
        <Message key="security-success" positive={true}>
          <Message.Header>Success</Message.Header>
          <Message.Content>You will shortly receive an email which will allow you to reset your password</Message.Content>
        </Message>
      );
    }
    return (
      <Message key="security-fail" warning={true}>
        <Message.Header>Error</Message.Header>
        <Message.Content>{this.state.changePasswordError}</Message.Content>
      </Message>
    );

  }

  public render() {
    const additionalFields = [
      (<h3 key="security-header">Security</h3>),
      this.renderChangePassword(),
    ];
    return (
      <Grid container={true} columns={1} id="Account">
        <Grid.Column>
          <Helmet>
            <title>Account</title>
          </Helmet>
          <h1>Account</h1>
          <UserSettings additionalFields={additionalFields}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export { Account };
