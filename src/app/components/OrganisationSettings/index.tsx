import * as React from 'react';
import {Form, Button, ButtonProps} from 'semantic-ui-react';
import {getOrganisation, IGetOrgResult, IUpdateOrgSettings, updateOrgSetting} from 'apollo/modules/organisation';
import {isNullOrUndefined} from 'util';
import {IOrgSettings} from '../../models/organisation';
import './style.less';

interface IProps extends IUpdateOrgSettings {
  org?: IGetOrgResult;
}

interface IState {
  settings?: IOrgSettings;
  saving?: boolean;
  error?: string;
}

class OrganisationSettingsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.syncState = this.syncState.bind(this);
    this.benTypeaheadChanged = this.benTypeaheadChanged.bind(this);
    this.save = this.save.bind(this);

    this.syncState(props);
  }

  public componentWillUpdate(nextProps: IProps) {
    this.syncState(nextProps);
  }

  private syncState(p: IProps) {
    if (!isNullOrUndefined(p.org.getOrganisation) && isNullOrUndefined(this.state.settings)) {
      this.setState({
        settings: p.org.getOrganisation.settings,
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
    this.props.updateOrgSetting(this.state.settings.beneficiaryTypeAhead)
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

  private benTypeaheadChanged(_, e) {
    this.setState({
      settings: {
        ...this.state.settings,
        beneficiaryTypeAhead: e.checked,
      },
    });
  }

  public render() {
    const settings = this.state.settings || {
      beneficiaryTypeAhead: false,
    };

    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }

    return (
      <Form loading={this.props.org.loading} id="organisation-settings">
        <Form.Checkbox checked={settings.beneficiaryTypeAhead} label="Show beneficiary suggestions" onChange={this.benTypeaheadChanged} />
        <Button {...startProps} onClick={this.save}>Save</Button>
        <p>{this.state.error}</p>
      </Form>
    );
  }
}

const OrganisationSettings = updateOrgSetting(getOrganisation(OrganisationSettingsInner, 'org'));
export { OrganisationSettings };
