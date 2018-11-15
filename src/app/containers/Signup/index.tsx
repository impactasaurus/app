import * as React from 'react';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import {ISignup, signup} from '../../apollo/modules/organisation';
import {IFormOutput, SignupForm} from '../../components/SignupForm';
import {isUserLoggedIn} from '../../redux/modules/user';
import {IStore} from '../../redux/IStore';
const { connect } = require('react-redux');

interface IProps extends IURLConnector, ISignup {
  isLoggedIn: boolean;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SignupInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  public componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.setURL('/');
    }
  }

  public componentDidUpdate() {
    if (this.props.isLoggedIn) {
      this.props.setURL('/');
    }
  }

  private onSubmit(v: IFormOutput): Promise<void> {
    return this.props.signup(v.name, v.email, v.password, v.organisation)
      .then(() => {
        this.props.setURL('/login');
      });
  }

  public render() {
    return <SignupForm onFormSubmit={this.onSubmit} />;
  }
}

const SignupInnerWithWrapper = PageWrapperHoC('Signup', 'signup', SignupInner);
export const Signup = signup<IProps>(SignupInnerWithWrapper);
