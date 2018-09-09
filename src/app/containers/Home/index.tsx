import * as React from 'react';
import { Helmet } from 'react-helmet';
import { TimelineEntry } from 'components/TimelineEntry';
import { Grid, Feed } from 'semantic-ui-react';
import {getMoreRecentMeetings, getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';
import {renderArray} from '../../helpers/react';
import * as InfiniteScroll from 'react-infinite-scroller';

const timelineEntry = (m) => <TimelineEntry meeting={m} />;

interface IProps {
  data?: IGetRecentMeetings;
}

class HomeInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  private loadMore() {
    this.props.data.fetchMore(getMoreRecentMeetings(this.props.data.getRecentMeetings.page+1));
  }

  public render() {
    if (!this.props.data.getRecentMeetings) {
      return (<div />);
    }
    return (
      <Grid container={true} columns={1} id="home">
        <Grid.Column>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <h1>Activity</h1>
          <InfiniteScroll
            initialLoad={false}
            loadMore={this.loadMore}
            hasMore={this.props.data.getRecentMeetings.isMore}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            <Feed>
              {this.props.data.getRecentMeetings && renderArray(timelineEntry, this.props.data.getRecentMeetings.meetings)}
            </Feed>
          </InfiniteScroll>
        </Grid.Column>
      </Grid>
    );
  }
}

export const Home = getRecentMeetings<any>(() => 0)(HomeInner);
