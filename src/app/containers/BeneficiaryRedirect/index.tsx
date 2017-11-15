import * as React from 'react';
import { saveAuth, isBeneficiaryUser, getBeneficiaryScope, getExpiryDateOfToken } from 'helpers/auth';
import {isUserLoggedIn, isBeneficiaryUser as isCurrentUserABeneficiary} from 'modules/user';
import { IStore } from 'redux/IStore';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {getJWT, IJWTResult} from 'apollo/modules/jwt';
import { Message, Loader, Grid, Button } from 'semantic-ui-react';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IURLConnector {
  params: {
      jti: string,
  };
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
  data: IJWTResult;
};

interface IState {
  error: boolean;
  expired: boolean;
  confirmed?: boolean;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isCurrentUserABeneficiary(state.user),
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class BeneficiaryRedirectInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      expired: false,
    };
    this.confirmed = this.confirmed.bind(this);
  }

  private logSuccessfulBenLogin() {
    ReactGA.event({
      category: 'beneficiary',
      action: 'login',
      label: 'jti',
    });
  }

  private performLoginProcess(props: IProps) {
    if (props.data.getJWT === undefined || props.data.getJWT === null) {
      return;
    }
    if (this.props.isLoggedIn && !this.props.isBeneficiary && !this.state.confirmed) {
      return;
    }
    const token = props.data.getJWT;
    const expires = getExpiryDateOfToken(token);
    if (expires === null || expires < new Date()) {
      this.setState({
        error: true,
        expired: true,
      });
      return;
    }
    saveAuth(token);
    if (isBeneficiaryUser() === false) {
      this.setState({
        error: true,
        expired: false,
      });
      return;
    }
    const scope = getBeneficiaryScope();
    if (scope === null) {
      this.setState({
        error: true,
        expired: false,
      });
      return;
    }
    this.logSuccessfulBenLogin();
    this.props.setURL(`/meeting/${scope}`);
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    // looking for the trigger state where either data is received or confirmation is received
    if (prevProps.data.getJWT === this.props.data.getJWT && prevState.confirmed === this.state.confirmed) {
      return;
    }
    this.performLoginProcess(this.props);
  }

  private confirmed() {
    this.setState({
      error: this.state.error,
      expired: this.state.expired,
      confirmed: true,
    });
  }

  private renderError(message: string): JSX.Element {
    return (
      <Grid container columns={1} id="benRedirect">
        <Grid.Column>
          <Message error={true}>
            <Message.Header>Error</Message.Header>
            <div>{message}</div>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }

  private confirmUserWantsToContinue(): JSX.Element {
    return (
      <Grid container columns={1} id="benRedirect">
        <Grid.Column>
          <Message warning={true}>
            <Message.Header>Warning</Message.Header>
            <div>Using this link will log you out of Impactasaurus</div>
            <br />
            <Button onClick={this.confirmed}>Continue</Button>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }

  public render() {
    if (this.props.isLoggedIn && !this.props.isBeneficiary && !this.state.confirmed) {
      return this.confirmUserWantsToContinue();
    }
    if (this.props.data.loading || (this.props.data.error === undefined && this.state.error === false)) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (this.state.expired) {
      return this.renderError('This link has expired. Please request a new link');
    }
    return this.renderError('This link is not valid. Please try refreshing, if it continues to fail, please request a new link');
  }
}

const BeneficiaryRedirect = getJWT<IProps>((props) => props.params.jti)(BeneficiaryRedirectInner);
export { BeneficiaryRedirect }
