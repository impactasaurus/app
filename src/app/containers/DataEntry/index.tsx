import React, { useState } from "react";
import {
  IMeetingResult,
  getMeeting,
  completeMeeting,
  IMeetingMutation,
} from "apollo/modules/meetings";
import { ButtonProps, Button } from "semantic-ui-react";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { IAnswer } from "models/answer";
import { IQuestion, Question } from "models/question";
import { QuestionInline } from "components/QuestionInline";
import { renderArray } from "helpers/react";
import { getHumanisedDateFromISO } from "helpers/moment";
import { QuestionnaireReview } from "components/QuestionnaireReview";
import { MeetingNotepad } from "components/MeetingNotepad";
import { connect } from "react-redux";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { useTranslation } from "react-i18next";
import "rc-slider/assets/index.css";

interface IProps extends IURLConnector, IMeetingMutation {
  data: IMeetingResult;
  match: {
    params: {
      id: string;
    };
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
}

enum Screen {
  QUESTION,
  NOTES,
  REVIEW,
}

function answeredAllQuestions(p: IProps): boolean {
  return p.questions.reduce((answeredAll, q) => {
    return (
      answeredAll && p.answers.find((a) => a.questionID === q.id) !== undefined
    );
  }, true);
}

const DataEntryInner = (p: IProps) => {
  const [saving, setSavingInner] = useState(false);
  const [screen, setScreen] = useState<Screen>(Screen.QUESTION);
  const { t } = useTranslation();

  const setPage = (page: Screen): (() => void) => {
    return () => {
      setScreen(page);
    };
  };

  const completed = () => {
    p.setURL(
      `/beneficiary/${p.data.getMeeting.beneficiary}`,
      `?q=${p.data.getMeeting.outcomeSetID}`
    );
  };

  const setSaving = (toSet: boolean) => {
    return () => {
      setSavingInner(toSet);
    };
  };

  const renderQuestion = (q: Question, idx: number): JSX.Element => {
    return (
      <QuestionInline
        key={q.id}
        index={idx + 1}
        record={p.data.getMeeting}
        questionID={q.id}
        onSaving={setSaving(true)}
        onSaved={setSaving(false)}
        disabled={saving}
      />
    );
  };

  const renderQuestionPage = (): JSX.Element => {
    const meeting = p.data.getMeeting;

    const props: ButtonProps = {};
    if (saving) {
      props.disabled = true;
    }
    if (!answeredAllQuestions(p)) {
      props.disabled = true;
    }

    return (
      <div>
        <h1>
          {meeting.beneficiary} - {getHumanisedDateFromISO(meeting.conducted)}
        </h1>
        {renderArray(renderQuestion, p.questions)}
        <Button {...props} onClick={setPage(Screen.NOTES)}>
          {t("Next")}
        </Button>
      </div>
    );
  };

  const renderFinished = (): JSX.Element => {
    return (
      <QuestionnaireReview
        record={p.data.getMeeting}
        onQuestionClick={setPage(Screen.QUESTION)}
        onBack={setPage(Screen.NOTES)}
        onComplete={completed}
      />
    );
  };

  const renderNotepad = (): JSX.Element => {
    return (
      <MeetingNotepad
        record={p.data.getMeeting}
        onComplete={setPage(Screen.REVIEW)}
        onBack={setPage(Screen.QUESTION)}
      />
    );
  };

  const meeting = p.data.getMeeting;
  if (meeting === undefined) {
    return <div />;
  }

  if (screen === Screen.REVIEW) {
    return renderFinished();
  }
  if (screen === Screen.NOTES) {
    return renderNotepad();
  }
  return renderQuestionPage();
};

const propsPreprocessing = (_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data !== undefined && ownProps.data.getMeeting !== undefined) {
    out.questions = (
      ownProps.data.getMeeting.outcomeSet.questions || []
    ).filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
};

const DataEntryConnected = connect(
  propsPreprocessing,
  UrlConnector
)(DataEntryInner);
// t("questionnaire")
const DataEntryLoader = ApolloLoaderHoC(
  "questionnaire",
  (p: IProps) => p.data,
  DataEntryConnected
);
const DataEntryWithData = completeMeeting<IProps>(
  getMeeting<IProps>((props) => props.match.params.id)(DataEntryLoader)
);
// t("Data Entry")
const DataEntry = MinimalPageWrapperHoC(
  "Data Entry",
  "data-entry",
  DataEntryWithData
);
export { DataEntry };
