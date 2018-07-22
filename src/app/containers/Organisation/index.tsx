import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {OrganisationSettings} from 'components/OrganisationSettings';

class Organisation extends React.Component<any, any> {

  public render() {
    return (
      <Grid container columns={1} id="organisation">
        <Grid.Column>
          <Helmet>
            <title>Organisation</title>
          </Helmet>
          <h1>Organisation</h1>
          <h3>Users</h3>
          <p>To add users to your organisation, please send their email addresses to <a href="mailto:support@impactasaurus.org?Subject=NewUsers">support@impactasaurus.org</a></p>
          <h3>Settings</h3>
          <p>The following settings apply to every user in your organisation:</p>
          <OrganisationSettings />
        </Grid.Column>
      </Grid>
    );
  }
}

export { Organisation }
