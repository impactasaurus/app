import React, { useState } from "react";
import {
  IMeetingResult,
  getMeeting,
  completeMeeting,
  IMeetingMutation,
  setMeetingNotes,
  ISetMeetingNotes,
} from "apollo/modules/meetings";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { IAnswer } from "models/answer";
import { IQuestion, Question } from "models/question";
import { QuestionInline } from "components/QuestionInline";
import { renderArray } from "helpers/react";
import { connect } from "react-redux";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { useTranslation } from "react-i18next";
import "rc-slider/assets/index.css";
import { ISODateString } from "components/Moment";
import { Notepad } from "components/Notepad";
import { Button, ButtonProps } from "semantic-ui-react";

interface IProps extends IURLConnector, IMeetingMutation, ISetMeetingNotes {
  data: IMeetingResult;
  match: {
    params: {
      id: string;
    };
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
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
  const [savingError, setSavingError] = useState<string>();
  const [notes, setNotes] = useState<string>(p.data.getMeeting.notes);
  const { t } = useTranslation();

  const completed = () => {
    const ben = p.data.getMeeting.beneficiary;
    const recordID = p.data.getMeeting.id;

    setSavingInner(true);
    p.setMeetingNotes(recordID, notes)
      .then(() => {
        return p.completeMeeting(recordID, ben);
      })
      .then(() => {
        setSavingInner(false);
        setSavingError(undefined);
        p.setURL(`/beneficiary/${ben}`, `?q=${p.data.getMeeting.outcomeSetID}`);
      })
      .catch((e: string) => {
        setSavingInner(false);
        setSavingError(e);
      });
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
    const placeholder = t("Record any additional comments, goals or actions");
    const saveProps: ButtonProps = {};
    if (saving) {
      saveProps.loading = true;
      saveProps.disabled = true;
    }
    if (!answeredAllQuestions(p)) {
      saveProps.disabled = true;
    }
    return (
      <div>
        <h1>
          {meeting.beneficiary} - <ISODateString iso={meeting.conducted} />
        </h1>
        {renderArray(renderQuestion, p.questions)}
        <h3>{t("Additional Comments")}</h3>
        <Notepad
          onChange={setNotes}
          notes={notes}
          collapsible={false}
          placeholder={placeholder}
        />
        <Button {...saveProps} onClick={completed}>
          {t("Save")}
        </Button>
        {savingError && <p>{savingError}</p>}
      </div>
    );
  };

  const meeting = p.data.getMeeting;
  if (meeting === undefined) {
    return <div />;
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
const DataEntryWithData = setMeetingNotes<IProps>(
  completeMeeting<IProps>(
    getMeeting<IProps>((props) => props.match.params.id)(DataEntryLoader)
  )
);
// t("Data Entry")
const DataEntry = MinimalPageWrapperHoC(
  "Data Entry",
  "data-entry",
  DataEntryWithData
);
export { DataEntry };
