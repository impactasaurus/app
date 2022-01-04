import React, { useState } from "react";
import { IMeetingMutation, completeMeeting } from "apollo/modules/meetings";
import { RecordQuestionSummary } from "components/RecordQuestionSummary";
import { Button, ButtonProps } from "semantic-ui-react";
import { IQuestion } from "models/question";
import { IMeeting } from "models/meeting";
import { useTranslation } from "react-i18next";
import { Error } from "components/Error";
import "rc-slider/assets/index.css";
import "./style.less";

interface IProps extends IMeetingMutation {
  record: IMeeting;
  onComplete: () => void;
  onBack: () => void;
  onQuestionClick: (questionID: string) => void;
}

const QuestionnaireReviewInner = (p: IProps) => {
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<boolean>(false);
  const { t } = useTranslation();

  const review = () => {
    setCompleting(true);
    setCompleteError(false);
    p.completeMeeting(p.record.id, p.record.beneficiary)
      .then(() => {
        setCompleting(false);
        setCompleteError(false);
        p.onComplete();
      })
      .catch((e: string | Error) => {
        console.error(e);
        setCompleting(false);
        setCompleteError(true);
      });
  };

  const navigateToQuestion = (selectedQ: IQuestion): Promise<void> => {
    p.onQuestionClick(selectedQ.id);
    return Promise.resolve();
  };

  const renderAnswerReview = (): JSX.Element => {
    return (
      <div className="answer-review">
        <RecordQuestionSummary
          recordID={p.record.id}
          onQuestionClick={navigateToQuestion}
        />
      </div>
    );
  };

  if (p.record === undefined) {
    return <div />;
  }
  const props: ButtonProps = {};
  if (completing) {
    props.loading = true;
    props.disabled = true;
  }
  return (
    <div id="questionnaire-review">
      <h1>{t("Review")}</h1>
      <p>
        {t(
          "Please review your answers below. Once you are happy, click save, to mark the record as complete."
        )}
      </p>
      {renderAnswerReview()}
      <Button onClick={p.onBack}>{t("Back")}</Button>
      <Button {...props} onClick={review}>
        {t("Save")}
      </Button>
      {completeError && <Error text={t("Failed to finalise record")} />}
    </div>
  );
};
const QuestionnaireReview = completeMeeting<IProps>(QuestionnaireReviewInner);
export { QuestionnaireReview };
