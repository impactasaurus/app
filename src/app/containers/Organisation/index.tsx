import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {OrganisationSettings} from 'components/OrganisationSettings';
import {InviteGenerator} from 'components/InviteGenerator';

class Organisation extends React.Component<any, any> {

  public render() {
    return (
      <Grid container={true} columns={1} id="organisation">
        <Grid.Column>
          <Helmet>
            <title>Organisation</title>
          </Helmet>
          <h1>Organisation</h1>
          <h3>Users</h3>
          <InviteGenerator />
          <h3>Settings</h3>
          <p>The following settings apply to every user in your organisation:</p>
          <OrganisationSettings />
        </Grid.Column>
      </Grid>
    );
  }
}

export { Organisation };
