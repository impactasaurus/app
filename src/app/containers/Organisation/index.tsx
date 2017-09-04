import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';

class Organisation extends React.Component<any, any> {

  public render() {
    return (
      <div>
        <Helmet>
          <title>Organisation</title>
        </Helmet>
        <Grid container columns={1} id="organisation">
          <Grid.Column>
            <h1>Organisation</h1>
            <h3>Users</h3>
            <p>To add users to your organisation, please send their email addresses to <a href="mailto:support@impactasaurus.org?Subject=NewUsers">support@impactasaurus.org</a></p>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export { Organisation }
