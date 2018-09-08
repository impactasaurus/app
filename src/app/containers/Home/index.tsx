import * as React from 'react';
import { Helmet } from 'react-helmet';
import { TimelineEntry } from 'components/TimelineEntry';
import { Grid, Feed } from 'semantic-ui-react';

export class Home extends React.Component<any, any> {
  public render() {
    return (
      <Grid container={true} columns={1} id="home">
        <Grid.Column>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <Feed>
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
            <TimelineEntry />
          </Feed>
        </Grid.Column>
      </Grid>
    );
  }
}
