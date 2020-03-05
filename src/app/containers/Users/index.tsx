import * as React from 'react';
import {InviteGenerator} from 'components/InviteGenerator';
import {OrganisationUsers} from 'components/OrganisationUsers';
import {MinimalPageWrapperHoC} from 'components/PageWrapperHoC';
import {Button, Responsive} from 'semantic-ui-react';

interface IState {
  showInviteLink?: boolean;
}

class UsersInner extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.newClicked = this.newClicked.bind(this);
    this.linkGenerated = this.linkGenerated.bind(this);
  }

  private newClicked() {
    this.setState({showInviteLink: true});
  }

  private linkGenerated(): void {
    this.setState({showInviteLink: false});
  }

  public render() {
    const newButton = (
      <span className="title-holder" style={{position: 'absolute', right: '1rem', marginTop: '0.5rem'}}>
        <Responsive as={Button} minWidth={620} icon="plus" content="Invite User" primary={true} onClick={this.newClicked} loading={this.state.showInviteLink} />
        <Responsive as={Button} maxWidth={619} icon="plus" primary={true} onClick={this.newClicked} loading={this.state.showInviteLink} />
      </span>
    );
    const inviteLink = <InviteGenerator onClosed={this.linkGenerated} />;
    return (
      <div>
        {newButton}
        <h1>Users</h1>
        {this.state.showInviteLink && inviteLink}
        <OrganisationUsers />
      </div>
    );
  }
}

const Users = MinimalPageWrapperHoC('Users', 'users', UsersInner);

export { Users };
