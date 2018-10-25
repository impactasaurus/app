import * as React from 'react';
import { Message, Button } from 'semantic-ui-react';
import {requestLogOut, RequestLogoutFunc} from '../../redux/modules/user';
import {bindActionCreators} from 'redux';
import {IStore} from '../../redux/IStore';
const { connect } = require('react-redux');

interface IProps {
  currentURL?: string;
  logout?: RequestLogoutFunc;
}

@connect((state: IStore) => ({
  currentURL: state.router.location.pathname,
}), (dispatch) => ({
  logout: bindActionCreators(requestLogOut, dispatch),
}))
export class LoggedInUserConfirmation extends React.Component<IProps, any> {

  private confirmed() {
    this.props.logout(this.props.currentURL);
  }

  public render() {
    const confirmed = this.confirmed.bind(this);
    return (
      <Message warning={true}>
        <Message.Header>Warning</Message.Header>
        <div>Using this link will log you out of Impactasaurus</div>
        <br />
        <Button onClick={confirmed}>Continue</Button>
      </Message>
    );
  }
}
