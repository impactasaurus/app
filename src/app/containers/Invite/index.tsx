import * as React from 'react';
import {isUserLoggedIn} from 'redux/modules/user';
import { IStore } from 'redux/IStore';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import {bindActionCreators} from 'redux';
import { Loader } from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {acceptInvite, checkInvite, IAcceptInvite, ICheckInvite} from 'apollo/modules/organisation';
import {IFormOutput, SignupForm} from 'components/SignupForm';
import {Error} from 'components/Error';
const { connect } = require('react-redux');

interface IProps extends IURLConnector, IAcceptInvite {
  match: {
    params: {
      id: string,
    },
  };
  isLoggedIn?: boolean;
  data?: ICheckInvite;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class InviteInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
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

  private onFormSubmit(v: IFormOutput): Promise<void> {
    return this.props.acceptInvite(v.name, v.email, v.password, this.props.match.params.id)
      .then(() => {
        this.props.setURL('/login');
      });
  }

  public render() {
    if (this.props.data.error) {
      return <Error text={`Failed to load invite`} />;
    }
    if (this.props.data.loading) {
      return <Loader active={true} inline="centered" />;
    }
    const initialValues: IFormOutput = {
      organisation: this.props.data.checkInvite,
      name: '',
      email: '',
      password: '',
      policyAcceptance: false,
    };
    return (
      <SignupForm onFormSubmit={this.onFormSubmit} initial={initialValues}/>
    );
  }
}

const InviteWithChecker = checkInvite<IProps>((p: IProps) => p.match.params.id)(InviteInner);
const InviteWithAccepter = acceptInvite<IProps>(InviteWithChecker);
export const Invite = PageWrapperHoC<IProps>('Welcome', 'invite', InviteWithAccepter);
