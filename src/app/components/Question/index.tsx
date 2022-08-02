import React, { useEffect, useState } from "react";
import { addLikertAnswer, IMeetingMutation } from "apollo/modules/meetings";
import { IQuestion, Question as QuestionType } from "models/question";
import { Likert } from "components/Likert";
import { Notepad } from "components/Notepad";
import { Button, ButtonProps } from "semantic-ui-react";
import { IIntAnswer, Answer, IAnswer } from "models/answer";
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
  const [value, setValue] = useState<number>();
  const [notes, setNotes] = useState<string>();
  const [saveState, setSaveState] = useState<{ err: boolean; saving: boolean }>(
    { err: false, saving: false }
  );

  useEffect(() => {
    if (p.record === undefined) {
      return;
    }
    const a = getAnswer() as IIntAnswer;
    if (a === undefined || a === null) {
      setNotes(undefined);
      setValue(undefined);
    } else {
      setNotes(a.notes);
      setValue(a.answer);
    }
  }, [p.questionID, p.record]);

  const getQuestion = (): IQuestion | undefined =>
    p.record.outcomeSet.questions.find((q) => q.id === p.questionID);

  const getAnswer = (): IAnswer | undefined =>
    p.record.answers.find((a) => a.questionID === p.questionID);

  const hasAnswerChanged = (prev: Answer): boolean =>
    prev === undefined || value !== prev.answer || notes !== prev.notes;

  const goToPreviousQuestion = () => p.onPrevious();

  const next = () => {
    const answer = getAnswer();
    if (hasAnswerChanged(answer as IIntAnswer) === false) {
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
  const question = getQuestion();
  if (question === undefined) {
    return <div>{t("Unknown question")}</div>;
  }
  const q = question as QuestionType;
  const nextProps: ButtonProps = {};
  if (saveState.saving) {
    nextProps.loading = true;
    nextProps.disabled = true;
  }
  if (value === undefined) {
    nextProps.disabled = true;
  }
  return (
    <div>
      <h1 className="close">{q.question}</h1>
      <h3>{q.description}</h3>
      <Likert
        key={"l-" + q.id}
        leftValue={q.leftValue}
        rightValue={q.rightValue}
        labels={q.labels}
        onChange={setValue}
        value={value}
      />
      <Notepad key={"np-" + q.id} onChange={setNotes} notes={notes} />
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
