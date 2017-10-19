import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Button } from 'semantic-ui-react';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {VizControlPanel} from 'components/VizControlPanel';
import {setURL} from 'modules/url';
const { connect } = require('react-redux');
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {IURLConnector} from 'redux/modules/url';
import {Aggregation, Visualisation, getAggregation, getVisualisation, getSelectedQuestionSetID} from 'models/pref';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {MeetingRadar} from 'components/MeetingRadar';
import {MeetingTable} from 'components/MeetingTable';
import './style.less';

interface IProps extends IURLConnector {
  params: {
      id: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  selectedQuestionSetID?: string;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
};

function isCategoryAggregationAvailable(meetings: IMeeting[], selectedQuestionSetID: string|undefined): boolean {
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return false;
  }
  const meetingsBelongingToSelectedQS = meetings.filter((m) => {
    return selectedQuestionSetID !== undefined && m.outcomeSetID === selectedQuestionSetID;
  });
  const meetingsWithCategories = meetingsBelongingToSelectedQS.filter((m) => {
    return m.outcomeSet.categories.length > 0;
  });
  return meetingsWithCategories.length > 0;
}

@connect((state: IStore, ownProps: IProps) => {
  const selectedQuestionSetID = getSelectedQuestionSetID(state.pref);
  const canCatAg = isCategoryAggregationAvailable(ownProps.data.getMeetings, selectedQuestionSetID);
  return {
    vis: getVisualisation(state.pref),
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    selectedQuestionSetID,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ReviewInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderInner = this.renderInner.bind(this);
    this.renderVis = this.renderVis.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
    };
  }
  private filterMeetings(m: IMeeting[], questionSetID: string): IMeeting[] {
    return m.filter((m) => m.outcomeSetID === questionSetID);
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (!Array.isArray(p.data.getMeetings) || p.data.getMeetings.length === 0) {
      return (
        <p>No meetings found for beneficiary {p.params.id}</p>
      );
    }

    const meetings = this.filterMeetings(p.data.getMeetings, this.props.selectedQuestionSetID);

    if (p.vis === Visualisation.RADAR) {
      return (
        <MeetingRadar aggregation={p.agg} meetings={meetings} />
      );
    }
    return (
      <MeetingTable aggregation={p.agg} meetings={meetings} />
    );
  }

  private getQuestionSetOptions(ms: IMeeting[]): string[] {
    if (!Array.isArray(ms)) {
      return [];
    }
    return ms.map((m) => m.outcomeSetID);
  }

  private renderInner(): JSX.Element {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <div>
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} />
        <QuestionSetSelect
          allowedQuestionSetIDs={this.getQuestionSetOptions(this.props.data.getMeetings)}
          autoSelectFirst={true}
        />
        {this.renderVis()}
      </div>
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    return (
      <Grid container columns={1}>
        <Grid.Column>
          <div id="review">
            <Helmet>
              <title>{this.props.params.id + ' Review'}</title>
            </Helmet>
            <h1>{this.props.params.id}</h1>
            {this.renderInner()}
          </div>
        </Grid.Column>
        <Grid.Column>
          <div id="back_div">
            <Button onClick={this.handleClick('/review')}  id="back-button">Back</Button>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

const Review = getMeetings<IProps>((p) => p.params.id)(ReviewInner);
export { Review }
