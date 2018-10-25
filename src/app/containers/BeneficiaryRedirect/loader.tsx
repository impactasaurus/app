import * as React from 'react';
import {saveAuth, isBeneficiaryUser, getBeneficiaryScope, getExpiryDateOfToken} from 'helpers/auth';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {getJWT, IJWTResult} from 'apollo/modules/jwt';
import { Message, Loader } from 'semantic-ui-react';
import {Error} from 'components/Error';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IURLConnector {
  jti: string;
  data?: IJWTResult;
}

interface IState {
  error: boolean;
  expired: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class JTILoaderInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      expired: false,
    };
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

  public componentDidUpdate(prevProps: IProps) {
    // looking for the trigger state where either data is received
    if (prevProps.data.getJWT === this.props.data.getJWT) {
      return;
    }
    this.performLoginProcess(this.props);
  }

  public render() {
    if (this.props.data.loading || (this.props.data.error === undefined && this.state.error === false)) {
      return <Loader active={true} inline="centered" />;
    }
    if (this.state.expired) {
      return (
        <Message error={true}>
          <Message.Header>Expired</Message.Header>
          <div>This link has expired. Please request a new link</div>
        </Message>
      );
    }
    return <Error text="This link does not seem to be valid"/>;
  }
}

export const JTILoader = getJWT<IProps>((props) => props.jti)(JTILoaderInner);
