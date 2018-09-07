import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {VizControlPanel} from 'components/VizControlPanel';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {IURLConnector, setURL} from 'redux/modules/url';
import {
  Aggregation, Visualisation, getAggregation, getVisualisation,
  getSelectedQuestionSetID, SelectedQuestionSetIDKey} from 'models/pref';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {MeetingRadar} from 'components/MeetingRadar';
import {MeetingTable} from 'components/MeetingTable';
import {isBeneficiaryUser} from 'redux/modules/user';
import {MeetingGraph} from 'components/MeetingGraph';
import {Error} from 'components/Error';

import {setPref, SetPrefFunc} from 'redux/modules/pref';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string,
    },
  };
  location: {
    // can provide a ?q=GUID, this will set the questionnaire being viewed to the provided GUID if valid
    search: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  selectedQuestionSetID?: string;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
  setPref?: SetPrefFunc;
}

function getURLQuestionnaire(p: IProps): string|undefined {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('q') === false) {
    return undefined;
  }
  return urlParams.get('q');
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

function isCanvasSnapshotPossible(v: Visualisation): boolean {
  return v === Visualisation.GRAPH || v === Visualisation.RADAR;
}

function getQuestionSetOptions(ms: IMeeting[]): string[] {
  if (!Array.isArray(ms)) {
    return [];
  }
  return ms.map((m) => m.outcomeSetID);
}

function getUniqueQuestionSetOptions(ms: IMeeting[]): string[] {
  const options = getQuestionSetOptions(ms);
  return options.filter((v, i, a) => a.indexOf(v) === i).sort();
}

function filterMeetings(m: IMeeting[], questionSetID: string): IMeeting[] {
  return m.filter((m) => m.outcomeSetID === questionSetID);
}

@connect((state: IStore, ownProps: IProps) => {
  const selectedQuestionSetID = getSelectedQuestionSetID(state.pref);
  const canCatAg = isCategoryAggregationAvailable(ownProps.data.getMeetings, selectedQuestionSetID);
  const viz = getVisualisation(state.pref, true);
  return {
    vis: viz,
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    selectedQuestionSetID,
    isBeneficiary: isBeneficiaryUser(state.user),
    isCanvasSnapshotPossible: isCanvasSnapshotPossible(viz),
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
  setPref: bindActionCreators(setPref, dispatch),
}))
class JourneyInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.renderJourney = this.renderJourney.bind(this);
    this.selectedURLQuestionnaire = this.selectedURLQuestionnaire.bind(this);
    this.exportBeneficiaryRecords = this.exportBeneficiaryRecords.bind(this);
  }

  public componentDidMount() {
    this.selectedURLQuestionnaire();
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const prevMeetings = this.props.data.getMeetings;
    const nextMeetings = nextProps.data.getMeetings;
    // If a beneficiary has been viewed, then a new questionnaire completed, the new questionnaire will not be auto
    // selected based on the URL, as the beneficiary's meetings do not contain the provided questionnaire ID based on
    // the data in the cache.
    // After the new data has been fetched, we can then auto select.
    const noPreviousRecords = Array.isArray(prevMeetings) === false && Array.isArray(nextMeetings) === true;
    const recordQuestionnairesHaveChanged = Array.isArray(prevMeetings) === true && Array.isArray(nextMeetings) === true
      && getUniqueQuestionSetOptions(prevMeetings).length !== getUniqueQuestionSetOptions(nextMeetings).length;
    if (noPreviousRecords || recordQuestionnairesHaveChanged) {
      this.selectedURLQuestionnaire();
    }
  }

  private selectedURLQuestionnaire() {
    const urlQS = getURLQuestionnaire(this.props);
    if (urlQS === undefined) {
      return;
    }
    this.props.setPref(SelectedQuestionSetIDKey, urlQS);
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

  private exportBeneficiaryRecords() {
    this.props.setURL(`/beneficiary/${this.props.match.params.id}/export/${this.props.selectedQuestionSetID}`);
  }

  private renderJourney(): JSX.Element {
    if (this.props.data.error) {
      return (<Error text="Failed to load records" />);
    }
    if (this.props.data.loading) {
      return (<Loader active={true} inline="centered" />);
    }
    if (!Array.isArray(this.props.data.getMeetings) || this.props.data.getMeetings.length === 0) {
      return (<p>No complete meetings found for beneficiary {this.props.match.params.id}</p>);
    }
    return (
      <div>
        <VizControlPanel
          canCategoryAg={this.props.isCategoryAgPossible}
          allowGraph={true}
          export={this.exportBeneficiaryRecords}
          allowCanvasSnapshot={this.props.isCanvasSnapshotPossible}
        />
        <QuestionSetSelect
          allowedQuestionSetIDs={getQuestionSetOptions(this.props.data.getMeetings)}
          autoSelectFirst={true}
        />
        {this.renderVis()}
      </div>
    );
  }

  public render() {
    if(this.props.match.params.id === undefined) {
      return (<div />);
    }

    return (
      <div id="journey">
        {this.renderJourney()}
      </div>
    );
  }
}

const Journey = getMeetings<IProps>((p) => p.match.params.id)(JourneyInner);
export { Journey };
