import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {Auth0Lock} from 'components/Auth0Lock';

interface IState {
  changePasswordStarted: boolean;
}

class Account extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {
      changePasswordStarted: false,
    };
    this.startChangePassword = this.startChangePassword.bind(this);
    this.renderChangePassword = this.renderChangePassword.bind(this);
  }

  private startChangePassword() {
    this.setState({
      changePasswordStarted: true,
    });
  }

  private renderChangePassword() {
    if (this.state.changePasswordStarted) {
      return (
        <Auth0Lock auth0Options={{initialScreen: 'forgotPassword'}} />
      );
    } else {
      return (
        <a onClick={this.startChangePassword}>Click here to change your password</a>
      );
    }
  }

  public render() {
    return (
      <div>
        <Helmet>
          <title>Account</title>
        </Helmet>
        <Grid container columns={1} id="Account">
          <Grid.Column>
            <h1>Account</h1>
            <h3>Change Password</h3>
            {this.renderChangePassword()}
            <h3>Delete Account</h3>
            <p>To delete your account, please send an email to <a href="mailto:support@impactasaurus.org?Subject=DeleteAccount">support@impactasaurus.org</a></p>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export { Account }
