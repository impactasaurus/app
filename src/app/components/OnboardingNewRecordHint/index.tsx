import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import {
  getRecentMeetings,
  IGetRecentMeetings,
} from "../../apollo/modules/meetings";
import { allOutcomeSets, IOutcomeResult } from "apollo/modules/outcomeSets";
import RocketIcon from "./../../theme/rocket.inline.svg";
import { useTranslation } from "react-i18next";

interface IProps {
  meetings?: IGetRecentMeetings;
  data?: IOutcomeResult;
}

const navigateToNewRecord = () => {
  window.location.href = "/record";
};

const inner = (p: IProps) => {
  const loading = p.data.loading || p.meetings.loading;
  if (loading) {
    return <div />;
  }
  const hasAtleastOneQuestionniare =
    p.data.allOutcomeSets && p.data.allOutcomeSets.length >= 1;
  const hasNoRecords =
    p.meetings.getRecentMeetings &&
    p.meetings.getRecentMeetings.meetings &&
    p.meetings.getRecentMeetings.meetings.length === 0;
  const shouldShow = hasNoRecords && hasAtleastOneQuestionniare;
  if (!shouldShow) {
    return <div />;
  }
  const { t } = useTranslation();
  return (
    <Segment
      key="quickStart"
      id="quick-start"
      raised={true}
      compact={true}
      style={{ marginLeft: "auto", marginRight: "auto" }}
    >
      <h3 style={{ fontWeight: "normal" }}>
        <RocketIcon style={{ width: "1rem", marginRight: ".3rem" }} />
        {t("What next?")}
      </h3>
      <p>
        {t("Nice one, the questionnaire has been added to your organisation")}
      </p>
      <p>
        {t(
          "Let's imitate a beneficiary and answer the questions, creating your first record"
        )}
      </p>
      <Button primary={true} onClick={navigateToNewRecord}>
        {t("New Record")}
      </Button>
    </Segment>
  );
};

const Component = (p: IProps) => {
  // this is best effort
  try {
    return inner(p);
  } catch {
    return <div />;
  }
};

export const OnboardingNewRecordHint = allOutcomeSets(
  getRecentMeetings(() => 0, "meetings")(Component)
);
