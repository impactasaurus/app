import * as React from 'react';
import { Helmet } from 'react-helmet';
import { TimelineEntry } from 'components/TimelineEntry';
import {Grid, Card, Loader, Responsive, SemanticWIDTHS} from 'semantic-ui-react';
import {getMoreRecentMeetings, getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';
import {renderArray} from '../../helpers/react';
import * as InfiniteScroll from 'react-infinite-scroller';
import {Error} from 'components/Error';
import {IMeeting} from 'models/meeting';
import './style.less';

const timelineEntry = (m: IMeeting) => <TimelineEntry key={m.id} meeting={m} />;

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
    const wrapper = (inner: JSX.Element): JSX.Element => (
      <Grid container={true} columns={1} id="home">
        <Grid.Column>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <div>
            <h1>Activity</h1>
            {inner}
          </div>
        </Grid.Column>
      </Grid>
    );
    if (this.props.data.error) {
      return wrapper(<Error text="Failed to load activity feed" />);
    }
    const d = this.props.data.getRecentMeetings;
    if (this.props.data.loading && !d) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    if (!d) {
      return wrapper(<div />);
    }
    const cards = (perRow: SemanticWIDTHS): JSX.Element => ((
      <Card.Group itemsPerRow={perRow}>
        {renderArray(timelineEntry, d.meetings)}
      </Card.Group>
    ));
    return wrapper((
      <InfiniteScroll
        initialLoad={false}
        loadMore={this.loadMore}
        hasMore={d.isMore}
        loader={<Loader className="end-of-timeline" key="spinner" active={true} inline="centered" />}
      >
        <Responsive minWidth={990}>
          {cards(4)}
        </Responsive>
        <Responsive minWidth={700} maxWidth={989}>
          {cards(3)}
        </Responsive>
        <Responsive minWidth={500} maxWidth={699}>
          {cards(2)}
        </Responsive>
        <Responsive maxWidth={499}>
          {cards(1)}
        </Responsive>
      </InfiniteScroll>
    ));
  }
}

export const Home = getRecentMeetings<any>(() => 0)(HomeInner);
