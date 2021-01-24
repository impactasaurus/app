import * as React from 'react';
import {Button, ButtonProps} from 'semantic-ui-react';
import {getOrganisation, IGetOrgResult} from 'apollo/modules/organisation';
const appConfig = require('../../../../config/main');
import { getToken } from 'helpers/auth';

interface IProps {
  org?: IGetOrgResult;
}

interface IState {
  loading?: boolean;
  error?: string;
}

class OrganisationDonInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.redirect = this.redirect.bind(this);
  }

  private redirect() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true,
      error: undefined,
    });

    fetch(`${appConfig.app.api}/v1/don/redirect?return=${window.location.href}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = data.url;
    })
    .catch((err) => {
      console.error(err);
      this.setState({
        loading: false,
        error: 'Failed to redrect, please try refreshing',
      });
    });
  }

  public render() {
    if(this.props.org.loading || !this.props.org.getOrganisation.don) {
        return <div />;
    }

    const redirectProps: ButtonProps = {};
    if (this.state.loading) {
      redirectProps.loading = true;
      redirectProps.disabled = true;
    }

    return [
      <h3 key="h3-don">Billing</h3>,
      <Button key="don-button" {...redirectProps} onClick={this.redirect}>Manage</Button>,
      <p key="don-err">{this.state.error}</p>,
    ];
  }
}

const OrganisationDon = getOrganisation(OrganisationDonInner, 'org');
export { OrganisationDon };
