import React, { useEffect, useState } from "react";
import { addLikertAnswer, IMeetingMutation } from "apollo/modules/meetings";
import { Question as QuestionType } from "models/question";
import { Likert } from "components/Likert";
import { Notepad } from "components/Notepad";
import { Button, ButtonProps } from "semantic-ui-react";
import { IIntAnswer } from "models/answer";
import { IMeeting } from "models/meeting";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "rc-slider/assets/index.css";

interface IProps extends IMeetingMutation {
  record: IMeeting;
  questionID: string;
  // defaults to true
  showPrevious?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function logGAEvent(action: string) {
  ReactGA.event({
    category: "assessment",
    label: "likert",
    action,
  });
}

const QuestionInner = (p: IProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(undefined);
  const [notes, setNotes] = useState<string>();
  const [saveState, setSaveState] = useState<{ err: boolean; saving: boolean }>(
    { err: false, saving: false }
  );

  const question: QuestionType = (p?.record?.outcomeSet?.questions || []).find(
    (q) => q.id === p.questionID
  ) as QuestionType;
  const answer: IIntAnswer = (p?.record?.answers || []).find(
    (a) => a.questionID === p.questionID
  ) as IIntAnswer;
  const hasAnswerChanged =
    answer === undefined || value !== answer.answer || notes !== answer.notes;

  useEffect(() => {
    if (answer === undefined || answer === null) {
      setNotes(undefined);
      setValue(undefined);
    } else {
      setNotes(answer.notes);
      setValue(answer.answer);
    }
  }, [answer]);

  const goToPreviousQuestion = () => p.onPrevious();
  const answerGiven = value !== undefined;
  const noteGivenIfRequired =
    question?.noteRequired !== true || (notes || "").length > 0;
  const canProgress = answerGiven && noteGivenIfRequired;

  const next = () => {
    if (!canProgress) {
      return;
    }
    if (!hasAnswerChanged) {
      p.onNext();
      return;
    }
    setSaveState({ saving: true, err: false });
    p.addLikertAnswer(p.record.id, p.questionID, value, notes)
      .then(() => {
        setSaveState({
          saving: false,
          err: false,
        });
        logGAEvent("answered");
        p.onNext();
      })
      .catch(() => {
        setSaveState({
          saving: false,
          err: true,
        });
      });
  };

  if (p.record === undefined) {
    return <div />;
  }
  if (question === undefined) {
    return <div>{t("Unknown question")}</div>;
  }
  const nextProps: ButtonProps = {};
  if (saveState.saving) {
    nextProps.loading = true;
    nextProps.disabled = true;
  }
  if (!canProgress) {
    nextProps.disabled = true;
  }
  return (
    <div>
      <h1 className="close">{question.question}</h1>
      <h3>{question.description}</h3>
      <Likert
        key={"l-" + question.id}
        leftValue={question.leftValue}
        rightValue={question.rightValue}
        labels={question.labels}
        onChange={setValue}
        value={value}
      />
      <Notepad
        key={"np-" + question.id}
        onChange={setNotes}
        notes={notes}
        required={question.noteRequired}
        prompt={question.notePrompt}
      />
      {p.showPrevious !== false && (
        <Button onClick={goToPreviousQuestion}>{t("Back")}</Button>
      )}
      <Button {...nextProps} onClick={next}>
        {t("Next")}
      </Button>
      {saveState.err && <p>{t("Failed to save your answer")}</p>}
    </div>
  );
};
const Question = addLikertAnswer<IProps>(QuestionInner);
export { Question };
