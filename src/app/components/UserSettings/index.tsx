import * as React from 'react';
import {Form, Button, ButtonProps} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {getSelf, IGetSelf, IUpdateSelf, updateSelf} from 'apollo/modules/user';
import {ISelfPatch} from 'models/user';
import './style.less';

interface IProps extends IUpdateSelf {
  self?: IGetSelf;
}

interface IState {
  patch?: ISelfPatch;
  saving?: boolean;
  error?: string;
}

class UserSettingsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.syncState = this.syncState.bind(this);
    this.unsubscribedChanged = this.unsubscribedChanged.bind(this);
    this.save = this.save.bind(this);

    this.syncState(props);
  }

  public componentWillUpdate(nextProps: IProps) {
    this.syncState(nextProps);
  }

  private syncState(p: IProps) {
    if (!isNullOrUndefined(p.self.getSelf) && isNullOrUndefined(this.state.patch)) {
      this.setState({
        patch: {
          unsubscribed: p.self.getSelf.settings.unsubscribed,
        },
      });
    }
  }

  private save() {
    if (this.state.saving) {
      return;
    }

    this.setState({
      saving: true,
      error: undefined,
    });
    this.props.updateSelf(this.state.patch.unsubscribed)
      .then(() => {
        this.setState({
          saving: false,
          error: undefined,
        });
      })
      .catch(() => {
        this.setState({
          saving: false,
          error: 'Failed to save, please try refreshing',
        });
      });
  }

  private unsubscribedChanged(_, e) {
    this.setState({
      patch: {
        ...this.state.patch,
        unsubscribed: !e.checked,
      },
    });
  }

  public render() {
    const patch = this.state.patch || {
      unsubscribed: false,
    };

    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }

    return (
      <Form loading={this.props.self.loading} id="user-settings">
        <Form.Checkbox checked={!patch.unsubscribed} label="Email me occasional updates from Impactasaurus" onChange={this.unsubscribedChanged} />
        <Button {...startProps} onClick={this.save}>Save</Button>
        <p>{this.state.error}</p>
      </Form>
    );
  }
}

const UserSettings = updateSelf(getSelf(UserSettingsInner, 'self'));
export { UserSettings };
