import * as React from 'react';
import {isUserLoggedIn} from 'redux/modules/user';
import { IStore } from 'redux/IStore';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import {bindActionCreators} from 'redux';
import { Loader, Message } from 'semantic-ui-react';
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
      if (this.props.data.error.message.includes('expired')) {
        return (
          <Message error={true}>
            <Message.Header>Invite Has Expired</Message.Header>
            <div>Please request a new one.</div>
          </Message>
        );
      }
      if (this.props.data.error.message.includes('found')) {
        return (
          <Message error={true}>
            <Message.Header>Unknown Invite</Message.Header>
            <div>We did not recognize this invite. Please ensure the URL is correct.</div>
          </Message>
        );
      }
      return <Error text={`Failed to load invite`} />;
    }
    if (this.props.data.loading) {
      return <Loader active={true} inline="centered" />;
    }
    return (
      <SignupForm onFormSubmit={this.onFormSubmit} collectOrgName={false}/>
    );
  }
}

const InviteWithChecker = checkInvite<IProps>((p: IProps) => p.match.params.id)(InviteInner);
const InviteWithAccepter = acceptInvite<IProps>(InviteWithChecker);
export const Invite = PageWrapperHoC<IProps>('Welcome', 'invite', InviteWithAccepter);
