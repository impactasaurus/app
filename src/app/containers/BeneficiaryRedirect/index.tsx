import * as React from 'react';
import { saveAuth, isBeneficiaryUser, getBeneficiaryScope, getExpiryDateOfToken } from 'helpers/auth';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {getJWT, IJWTResult} from 'apollo/modules/jwt';
import { Message, Loader, Grid } from 'semantic-ui-react';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  params: {
      jti: string,
  };
  data: IJWTResult;
};

interface IState {
  error: boolean;
  expired: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class BeneficiaryRedirectInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      expired: false,
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data.getJWT === this.props.data.getJWT ||
      nextProps.data.getJWT === undefined || nextProps.data.getJWT === null) {
      return;
    }
    const token = nextProps.data.getJWT;
    const expires = getExpiryDateOfToken(token);
    if (expires === null || expires < new Date()) {
      this.setState({
        error: true,
        expired: true,
      });
      return;
    }
    saveAuth(nextProps.data.getJWT);
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
    this.props.setURL(`/meeting/${scope}`);
  }

  private renderError(message: string): JSX.Element {
    return (
      <Grid container columns={1} id="home">
        <Grid.Column>
          <Message error={true}>
            <Message.Header>Error</Message.Header>
            <div>{message}</div>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }

  public render() {
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
