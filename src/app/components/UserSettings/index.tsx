import * as React from 'react';
import {Form, Button, ButtonProps, Input} from 'semantic-ui-react';
import {getSelf, IGetSelf, IUpdateSelf, updateSelf} from 'apollo/modules/user';
import { ISelfPatch} from 'models/user';
import './style.less';
import {FormField} from 'components/FormField';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';

interface IProps extends IUpdateSelf {
  self?: IGetSelf;
}

interface IState {
  patch?: ISelfPatch;
  saving?: boolean;
  error?: string;
}

class UserSettingsInner extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {};
    this.unsubscribedChanged = this.unsubscribedChanged.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      patch: {
        unsubscribed: props.self.getSelf.settings.unsubscribed,
        name: props.self.getSelf.profile.name,
      },
    };
  }

  private save() {
    if (this.state.saving) {
      return;
    }

    this.setState({
      saving: true,
      error: undefined,
    });
    this.props.updateSelf(this.state.patch.name, this.state.patch.unsubscribed)
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

  private nameChanged(_, e) {
    this.setState({
      patch: {
        ...this.state.patch,
        name: e.value,
      },
    });
  }

  public render() {
    const patch: ISelfPatch = this.state.patch;

    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }

    return (
      <Form loading={this.props.self.loading} id="user-settings">
        <FormField touched={true} inputID="usn" required={true} label="Name">
          <Input type="text" placeholder="Your Name" value={patch.name} onChange={this.nameChanged}/>
        </FormField>
        <Form.Checkbox checked={!patch.unsubscribed} label="Email me occasional updates from Impactasaurus" onChange={this.unsubscribedChanged} />
        <Button {...startProps} onClick={this.save}>Save</Button>
        <p>{this.state.error}</p>
      </Form>
    );
  }
}

const UserSettingsWithLoader = ApolloLoaderHoC('user', (p: IProps) => p.self, UserSettingsInner);
const UserSettings = updateSelf(getSelf(UserSettingsWithLoader, 'self'));
export { UserSettings };
