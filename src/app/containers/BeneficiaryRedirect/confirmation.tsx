import * as React from 'react';
import {clearAuth} from '../../helpers/auth';
import { Message, Button } from 'semantic-ui-react';

export class LoggedInUserConfirmation extends React.Component<any, any> {

  private confirmed() {
    clearAuth();
    document.location.reload(true);
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
