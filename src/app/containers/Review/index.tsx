import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Button, Message } from 'semantic-ui-react';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {VizControlPanel} from 'components/VizControlPanel';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {IURLConnector} from 'redux/modules/url';
import {Aggregation, Visualisation, getAggregation, getVisualisation, getSelectedQuestionSetID} from 'models/pref';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {MeetingRadar} from 'components/MeetingRadar';
import {MeetingTable} from 'components/MeetingTable';
import {isBeneficiaryUser} from 'modules/user';
import './style.less';
import {MeetingGraph} from '../../components/MeetingGraph';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  params: {
      id: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  selectedQuestionSetID?: string;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
  isBeneficiary: boolean;
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
    vis: getVisualisation(state.pref, true),
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    selectedQuestionSetID,
    isBeneficiary: isBeneficiaryUser(state.user),
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
    const { data: { getMeetings }, params: { id }, vis, selectedQuestionSetID, agg } = this.props;
    if (!Array.isArray(getMeetings) || getMeetings.length === 0) {
      return (
        <p>No meetings found for beneficiary {id}</p>
      );
    }

    const meetings = this.filterMeetings(getMeetings, selectedQuestionSetID);

    if (vis === Visualisation.RADAR) {
      return (
        <MeetingRadar aggregation={agg} meetings={meetings} />
      );
    }
    if (vis === Visualisation.GRAPH) {
      return (
        <MeetingGraph meetings={meetings} aggregation={agg}/>
      );
    }
    return (
      <MeetingTable aggregation={agg} meetings={meetings} />
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
    if (this.props.data.error !== undefined) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Failed to load assessments</div>
        </Message>
      );
    }
    return (
      <div>
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} allowGraph={true}/>
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

    let backButton: JSX.Element = (<div />);
    if (this.props.isBeneficiary === false) {
      backButton = (<Button onClick={this.handleClick('/beneficiary')} content="Back" icon="left arrow" labelPosition="left" primary id="back-button"/>);
    }

    return (
      <Grid container columns={1}>
        <Grid.Column>
          {backButton}
          <div id="review">
            <Helmet>
              <title>{this.props.params.id + ' Review'}</title>
            </Helmet>
            <h1>{this.props.params.id}</h1>
            {this.renderInner()}
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

const Review = getMeetings<IProps>((p) => p.params.id)(ReviewInner);
export { Review }
