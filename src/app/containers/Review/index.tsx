import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Button, Message, Menu } from 'semantic-ui-react';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {VizControlPanel} from 'components/VizControlPanel';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {IURLConnector} from 'redux/modules/url';
import {Aggregation, Visualisation, getAggregation, getVisualisation, getSelectedQuestionSetID} from 'models/pref';
import {getIncompleteMeetings, getMeetings, IIncompleteMeetingsResult, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {MeetingRadar} from 'components/MeetingRadar';
import {MeetingTable} from 'components/MeetingTable';
import {isBeneficiaryUser} from 'modules/user';
import './style.less';
import {RecordList} from 'components/RecordList';
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
  incompleteMeetings?: IIncompleteMeetingsResult;
  isCategoryAgPossible?: boolean;
  isBeneficiary: boolean;
}

export enum ReviewPage {
  JOURNEY,
  RECORDS,
}

interface IState {
  innerPage?: ReviewPage;
}

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

function getQuestionSetOptions(ms: IMeeting[]): string[] {
  if (!Array.isArray(ms)) {
    return [];
  }
  return ms.map((m) => m.outcomeSetID);
}

function filterMeetings(m: IMeeting[], questionSetID: string): IMeeting[] {
  return m.filter((m) => m.outcomeSetID === questionSetID);
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
class ReviewInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.renderInner = this.renderInner.bind(this);
    this.renderVis = this.renderVis.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getInnerPage = this.getInnerPage.bind(this);
    this.renderSubMenu = this.renderSubMenu.bind(this);
    this.innerPageSetter = this.innerPageSetter.bind(this);
    this.renderJourney = this.renderJourney.bind(this);
    this.renderRecords = this.renderRecords.bind(this);
  }

  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
    };
  }

  private getInnerPage(): ReviewPage {
    return this.state.innerPage || ReviewPage.JOURNEY;
  }

  private innerPageSetter(toSet: ReviewPage): () => void {
    return () => {
      this.setState({
        innerPage: toSet,
      });
    };
  }

  private renderVis(): JSX.Element {
    const { data: { getMeetings }, vis, selectedQuestionSetID, agg } = this.props;
    const meetings = filterMeetings(getMeetings, selectedQuestionSetID);

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

  private renderJourney(): JSX.Element {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (this.props.data.error !== undefined) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Failed to load records</div>
        </Message>
      );
    }
    if (!Array.isArray(this.props.data.getMeetings) || this.props.data.getMeetings.length === 0) {
      return (
        <p>No complete meetings found for beneficiary {this.props.params.id}</p>
      );
    }
    return (
      <div>
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} allowGraph={true}/>
        <QuestionSetSelect
          allowedQuestionSetIDs={getQuestionSetOptions(this.props.data.getMeetings)}
          autoSelectFirst={true}
        />
        {this.renderVis()}
      </div>
    );
  }

  private renderRecords(): JSX.Element {
    if (this.props.data.loading || this.props.incompleteMeetings.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (this.props.data.error !== undefined || this.props.incompleteMeetings.error !== undefined) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Failed to load records</div>
        </Message>
      );
    }
    const noCompleteMeetings = !Array.isArray(this.props.data.getMeetings) || this.props.data.getMeetings.length === 0;
    const noIncompleteMeetings = !Array.isArray(this.props.incompleteMeetings.getIncompleteMeetings) || this.props.incompleteMeetings.getIncompleteMeetings.length === 0;
    if (noCompleteMeetings && noIncompleteMeetings) {
      return (
        <p>No meetings found for beneficiary {this.props.params.id}</p>
      );
    }
    return (
      <RecordList meetings={[].concat(...this.props.data.getMeetings, ...this.props.incompleteMeetings.getIncompleteMeetings)} />
    );
  }

  private renderInner(): JSX.Element {
    const page = this.getInnerPage();
    if (page === ReviewPage.JOURNEY) {
      return this.renderJourney();
    }
    return this.renderRecords();
  }

  private renderSubMenu(): JSX.Element {
    const inner = this.getInnerPage();
    return (
      <Menu pointing secondary>
        <Menu.Item name="Journey" active={inner === ReviewPage.JOURNEY} onClick={this.innerPageSetter(ReviewPage.JOURNEY)}/>
        <Menu.Item name="Records" active={inner === ReviewPage.RECORDS} onClick={this.innerPageSetter(ReviewPage.RECORDS)}/>
      </Menu>
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    let backButton: JSX.Element = (<div />);
    if (this.props.isBeneficiary === false) {
      backButton = (<Button onClick={this.handleClick('/review')} content="Back" icon="left arrow" labelPosition="left" primary id="back-button"/>);
    }

    return (
      <div>
        <Grid container columns={1}>
          <Grid.Column>
            {backButton}
            <div id="review">
              <Helmet>
                <title>{this.props.params.id + ' Review'}</title>
              </Helmet>
              <h1>{this.props.params.id}</h1>
              {this.renderSubMenu()}
              {this.renderInner()}
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const Review = getIncompleteMeetings<IProps>((p) => p.params.id, 'incompleteMeetings')(getMeetings<IProps>((p) => p.params.id)(ReviewInner));
export { Review }
