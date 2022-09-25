import React from "react";
import { QuestionnaireSelect } from "components/QuestionnaireSelect/pref";
import { VizControlPanel } from "components/VizControlPanel";
import { bindActionCreators } from "redux";
import { IStore } from "redux/IStore";
import { IURLConnector, setURL } from "redux/modules/url";
import {
  Aggregation,
  getAggregation,
  getSelectedQuestionSetID,
  getVisualisation,
  Visualisation,
} from "models/pref";
import { getMeetings, IMeetingResult } from "apollo/modules/meetings";
import { IMeeting } from "models/meeting";
import { MeetingRadar } from "components/MeetingRadar";
import { MeetingTable } from "components/MeetingTable";
import { isBeneficiaryUser } from "redux/modules/user";
import { MeetingGraph } from "components/MeetingGraph";
import { connect } from "react-redux";
import { WithTranslation, withTranslation } from "react-i18next";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { BeneficiaryNewRecordButtonID } from "containers/Beneficiary";
import {
  IntroduceBenPage,
  WhatNextAfterNewRecordTour,
} from "components/TourRecordCreation";

const allowedVisualisations = [
  Visualisation.RADAR,
  Visualisation.GRAPH,
  Visualisation.TABLE,
];

interface IProps extends IURLConnector, WithTranslation {
  match: {
    params: {
      id: string;
    };
  };
  vis?: Visualisation;
  agg?: Aggregation;
  selectedQuestionSetID?: string;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
}

function isCategoryAggregationAvailable(
  meetings: IMeeting[],
  selectedQuestionSetID: string | undefined
): boolean {
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return false;
  }
  const meetingsBelongingToSelectedQS = meetings.filter((m) => {
    return (
      selectedQuestionSetID !== undefined &&
      m.outcomeSetID === selectedQuestionSetID
    );
  });
  const meetingsWithCategories = meetingsBelongingToSelectedQS.filter((m) => {
    return m.outcomeSet.categories.length > 0;
  });
  return meetingsWithCategories.length > 0;
}

function isCanvasSnapshotPossible(v: Visualisation): boolean {
  return v === Visualisation.GRAPH || v === Visualisation.RADAR;
}

function getUniqueQuestionSetOptions(ms: IMeeting[]): string[] {
  return (ms || [])
    .map((m) => m.outcomeSetID)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();
}

function filterMeetings(m: IMeeting[], questionSetID: string): IMeeting[] {
  return m.filter((m) => m.outcomeSetID === questionSetID);
}

class JourneyInner extends React.Component<IProps, null> {
  constructor(props: IProps) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.renderJourney = this.renderJourney.bind(this);
    this.exportBeneficiaryRecords = this.exportBeneficiaryRecords.bind(this);
  }

  private renderVis(): JSX.Element {
    const {
      data: { getMeetings },
      vis,
      selectedQuestionSetID,
      agg,
    } = this.props;
    const meetings = filterMeetings(getMeetings, selectedQuestionSetID);

    if (vis === Visualisation.RADAR) {
      return <MeetingRadar aggregation={agg} meetings={meetings} />;
    }
    if (vis === Visualisation.GRAPH) {
      return <MeetingGraph meetings={meetings} aggregation={agg} />;
    }
    return <MeetingTable aggregation={agg} meetings={meetings} />;
  }

  private exportBeneficiaryRecords() {
    this.props.setURL(
      `/beneficiary/${this.props.match.params.id}/export/${this.props.selectedQuestionSetID}`
    );
  }

  private renderJourney(): JSX.Element {
    if (!this.props.data) {
      return <div />;
    }
    const t = this.props.t;
    if (
      !Array.isArray(this.props.data.getMeetings) ||
      this.props.data.getMeetings.length === 0
    ) {
      return (
        <p>
          {t("No complete meetings found for beneficiary {name}", {
            name: this.props.match.params.id,
          })}
        </p>
      );
    }
    const JourneyVisContainerID = "journey-vis-container";
    const distinctQuestionnaires = getUniqueQuestionSetOptions(
      this.props.data.getMeetings
    );
    return (
      <div>
        <WhatNextAfterNewRecordTour />
        <VizControlPanel
          canCategoryAg={this.props.isCategoryAgPossible}
          visualisations={allowedVisualisations}
          export={this.exportBeneficiaryRecords}
          allowCanvasSnapshot={this.props.isCanvasSnapshotPossible}
        />
        <QuestionnaireSelect
          // this key forces a refresh of the questionnaire selector
          // when the number of distinct questionnaires change.
          // This is needed when a ben is viewed, then a new questionnaire
          // is completed. This ensures we show the new questionnaire after
          // completion
          key={`q-s-${distinctQuestionnaires.length}`}
          allowedQuestionnaireIDs={distinctQuestionnaires}
          autoSelectFirst={true}
        />
        <div id={JourneyVisContainerID}>{this.renderVis()}</div>
        <IntroduceBenPage
          benID={this.props.match.params.id}
          visContainerID={JourneyVisContainerID}
          newRecordButtonID={BeneficiaryNewRecordButtonID}
        />
      </div>
    );
  }

  public render() {
    if (this.props.match.params.id === undefined) {
      return <div />;
    }

    return <div id="journey">{this.renderJourney()}</div>;
  }
}

const storeToProps = (state: IStore, ownProps: IProps) => {
  const selectedQuestionSetID = getSelectedQuestionSetID(state.pref);
  const canCatAg = isCategoryAggregationAvailable(
    ownProps.data.getMeetings,
    selectedQuestionSetID
  );
  const viz = getVisualisation(state.pref, allowedVisualisations);
  return {
    vis: viz,
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    selectedQuestionSetID,
    isBeneficiary: isBeneficiaryUser(state.user),
    isCanvasSnapshotPossible: isCanvasSnapshotPossible(viz),
  };
};

const dispatchToProps = (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
});

const JourneyI18n = withTranslation()(JourneyInner);
const JourneyConnected = connect(storeToProps, dispatchToProps)(JourneyI18n);
// t("records")
const JourneyLoader = ApolloLoaderHoC(
  "records",
  (p: IProps) => p.data,
  JourneyConnected
);
const Journey = getMeetings<IProps>((p) => p.match.params.id)(JourneyLoader);
export { Journey };
