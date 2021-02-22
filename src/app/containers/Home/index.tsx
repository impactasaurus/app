import * as React from 'react';
import { TimelineEntry } from 'components/TimelineEntry';
import {Card, Loader, Responsive, SemanticWIDTHS, Button} from 'semantic-ui-react';
import {getMoreRecentMeetings, getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';
import {renderArray} from '../../helpers/react';
import InfiniteScroll from 'react-infinite-scroller';
import {Error} from 'components/Error';
import {IMeeting} from 'models/meeting';
import './style.less';
import {IURLConnector, setURL} from '../../redux/modules/url';
import {bindActionCreators} from 'redux';
import {OnboardingChecklist} from 'components/OnboardingChecklist';
import {MinimalPageWrapperHoC} from 'components/PageWrapperHoC';
const { connect } = require('react-redux');

const timelineEntry = (m: IMeeting): JSX.Element => <TimelineEntry key={m.id} meeting={m} />;
const hasRecords = (p: IProps, moreThan = 0): boolean|undefined => {
  if (!p.data || !p.data.getRecentMeetings || !p.data.getRecentMeetings.meetings) {
    return undefined;
  }
  return p.data.getRecentMeetings.meetings.length > moreThan;
};

interface IProps extends IURLConnector {
  data?: IGetRecentMeetings;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class HomeInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.newRecord = this.newRecord.bind(this);
  }

  private loadMore() {
    this.props.data.fetchMore(getMoreRecentMeetings(this.props.data.getRecentMeetings.page+1));
  }

  private newRecord() {
    this.props.setURL('/record');
  }

  public render() {
    const recordsExist = hasRecords(this.props);
    const wrapper = (inner: JSX.Element): JSX.Element => (
      <div>
        <span className="title-holder">
          <Responsive as={Button} minWidth={620} icon="plus" content="New Record" primary={true} onClick={this.newRecord} />
          <Responsive as={Button} maxWidth={619} icon="plus" primary={true} onClick={this.newRecord} />
        </span>
        <OnboardingChecklist
          dismissible={recordsExist}
          forceDismiss={hasRecords(this.props, 8)}
        />
        {recordsExist !== false &&
          <div>
            <h1>Activity</h1>
            {inner}
          </div>
        }
      </div>
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

const homeWithPageWrapper = MinimalPageWrapperHoC('Home', 'home', HomeInner);
export const Home = getRecentMeetings<any>(() => 0)(homeWithPageWrapper);
