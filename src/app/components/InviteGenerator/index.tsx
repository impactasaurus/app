import * as React from 'react';
import {Modal, Input, ButtonProps} from 'semantic-ui-react';
import {generateInvite, IGenerateInvite} from 'apollo/modules/organisation';
import {Error} from 'components/Error';
const config = require('../../../../config/main');

interface IState {
  inviteID?: string;
  error?: boolean;
  loading?: boolean;
}

interface IProps extends IGenerateInvite {
  onClosed?: () => void;
}

class InviteGeneratorInner extends React.Component<IProps, IState> {

  private readonly linkInput: React.RefObject<Input>;

  constructor(props) {
    super(props);
    this.state = {};
    this.onGen = this.onGen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.linkInput = React.createRef();
    this.onGen();
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

  private copyLink() {
    const node = this.linkInput.current;
    (node as any).select();
    document.execCommand('copy');
  }

  private onClose() {
    this.setState({inviteID: undefined});
    if (this.props.onClosed !== undefined) {
      this.props.onClosed();
    }
  }

  public render() {
    if (this.state.inviteID) {
      const url = `${config.app.root}/invite/${this.state.inviteID}`;
      const action: ButtonProps = {
        primary: true,
        labelPosition: 'right',
        icon: 'copy',
        content: 'Copy',
        onClick: this.copyLink,
      };
      const modalContent = (
        <div style={{margin: '1em'}}>
          <p>
            <span>This link allows others to join your Impactasaurus. Simply send it to your colleagues</span>
          </p>
          <p>
            <Input
              action={action}
              defaultValue={url}
              ref={this.linkInput}
            />
          </p>
        </div>
      );
      return (
        <Modal
          header="Your invite link"
          content={modalContent}
          actions={['Close']}
          open={true}
          onClose={this.onClose}
        />
      );
    }
    if (this.state.error) {
      return <Error text="Failed to generate invite" />;
    }
    return <div />;
  }
}

const InviteGenerator = generateInvite<IProps>(InviteGeneratorInner);
export {InviteGenerator};
