import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {InviteGenerator} from 'components/InviteGenerator';
import {OrganisationUsers} from 'components/OrganisationUsers';

class Users extends React.Component<any, any> {

  public render() {
    return (
      <Grid container={true} columns={1} id="users">
        <Grid.Column>
          <Helmet>
            <title>Users</title>
          </Helmet>
          <h1>Users</h1>
          <OrganisationUsers />
          <InviteGenerator />
        </Grid.Column>
      </Grid>
    );
  }
}

export { Users };
