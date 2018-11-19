import * as React from 'react';
import {Button} from 'semantic-ui-react';
import {generateInvite, IGenerateInvite} from 'apollo/modules/organisation';
import {Error} from 'components/Error';
const config = require('../../../../config/main');

interface IState {
  inviteID?: string;
  error?: boolean;
  loading?: boolean;
}

const InviteLink = (p: {
  id: string;
}) => {
  const url = `${config.app.root}/invite/${p.id}`;
  return (
    <div className="invite-gen">
      <p>Here is your invite link. The link will expire after a week.</p>
      <a href={url}>{url}</a>
    </div>
  );
};

class InviteGeneratorInner extends React.Component<IGenerateInvite, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.onGen = this.onGen.bind(this);
  }

  private onGen() {
    if (this.state.loading === true) {
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.generateInvite()
      .then((invite: string) => {
        this.setState({
          inviteID: invite,
          error: false,
          loading: false,
        });
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          error: true,
          loading: false,
        });
      });
  }

  public render() {
    if (this.state.inviteID) {
      return <InviteLink id={this.state.inviteID} />;
    }
    if (this.state.error) {
      return <Error text="Failed to generate invite" />;
    }
    return (
      <div className="invite-gen">
        <p>Click the button below to generate an invite link. Anyone can use this link to join your Impactasaurus.</p>
        <Button onClick={this.onGen} loading={this.state.loading === true}>Generate Invite Link</Button>
      </div>
    );
  }
}

const InviteGenerator = generateInvite(InviteGeneratorInner);
export {InviteGenerator};
