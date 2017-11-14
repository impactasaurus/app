import * as React from 'react';
import { saveAuth, isBeneficiaryUser, getBeneficiaryScope } from 'helpers/auth';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Message, Loader, Grid } from 'semantic-ui-react';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  params: {
      jwt: string,
  };
};

interface IState {
  error: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class BeneficiaryRedirect extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  public componentDidMount() {
    saveAuth(this.props.params.jwt);
    if (isBeneficiaryUser() === false) {
      this.setState({
        error: true,
      });
      return;
    }
    const scope = getBeneficiaryScope();
    if (scope === null) {
      this.setState({
        error: true,
      });
      return;
    }
    this.props.setURL(`meeting/${scope}`);
  }

  public render() {
    if (this.state.error === false) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <Grid container columns={1} id="home">
        <Grid.Column>
          <Message error={true}>
            <Message.Header>Error</Message.Header>
            <div>This link is not valid. Please request a new link</div>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export {BeneficiaryRedirect}
