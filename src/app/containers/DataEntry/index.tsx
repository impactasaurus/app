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
import { ISODateString } from "components/Moment";
import { Notepad } from "components/Notepad";
import { Button, ButtonProps } from "semantic-ui-react";
import { Error } from "components/Error";
import { IOutcomeSet } from "models/outcomeSet";
import "rc-slider/assets/index.css";

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

const completedQuestionnaire = (
  questions: IQuestion[],
  answers: IAnswer[],
  questionnaire: IOutcomeSet,
  notes: string
): boolean => {
  if (questionnaire?.noteRequired && (notes || "").length === 0) {
    return false;
  }
  return questions.reduce((prev, q) => {
    const answer = answers.find((a) => a.questionID === q.id);
    if (!answer) {
      return false;
    }
    if ((q as Question).noteRequired && (answer.notes || "").length === 0) {
      return false;
    }
    return prev;
  }, true);
};

const DataEntryInner = (p: IProps) => {
  const [saving, setSavingInner] = useState(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>(p.data.getMeeting.notes);
  const { t } = useTranslation();

  const completed = () => {
    const ben = p.data.getMeeting.beneficiary;
    const recordID = p.data.getMeeting.id;

    setSavingInner(true);
    setSavingError(false);
    p.setMeetingNotes(recordID, notes)
      .then(() => {
        return p.completeMeeting(recordID, ben);
      })
      .then(() => {
        setSavingInner(false);
        setSavingError(false);
        p.setURL(`/beneficiary/${ben}`, `?q=${p.data.getMeeting.outcomeSetID}`);
      })
      .catch((e: string | Error) => {
        console.error(e);
        setSavingInner(false);
        setSavingError(true);
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
    if (
      !completedQuestionnaire(p.questions, p.answers, meeting.outcomeSet, notes)
    ) {
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
          prompt={meeting.outcomeSet?.notePrompt || false}
          placeholder={meeting.outcomeSet?.notePrompt ? undefined : placeholder}
          required={meeting.outcomeSet?.noteRequired}
        />
        <Button
          {...saveProps}
          onClick={completed}
          style={{ marginTop: "20px" }}
        >
          {t("Save")}
        </Button>
        {savingError && <Error text={t("Failed to finalise record")} />}
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
