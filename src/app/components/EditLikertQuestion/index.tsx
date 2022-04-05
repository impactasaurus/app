import React, { useMemo } from "react";
import {
  editLikertQuestion,
  IEditLikertQuestion,
  IEditLikertQuestionInput,
} from "apollo/modules/questions/editLikertQuestion";
import { IOutcomeSet } from "models/outcomeSet";
import { LikertQuestionForm } from "../LikertQuestionForm/index";
import { ILikertQuestionForm, Question } from "models/question";
import {
  ICategoryMutation,
  setCategory,
} from "../../apollo/modules/categories";
import { useTranslation } from "react-i18next";
import {
  IIsQuestionnaireInUse,
  isQuestionnaireInUse,
} from "apollo/modules/meetings/isQuestionnaireInUse";

interface IProps extends ICategoryMutation, IEditLikertQuestion {
  data?: IIsQuestionnaireInUse;

  QuestionSetID: string;
  OnSuccess: () => void;
  OnCancel: () => void;
  question: Question;
}

const EditLikertQuestionInner = (p: IProps) => {
  const { t } = useTranslation();
  const inUse = useMemo(() => {
    if (p?.data?.isQuestionnaireInUse?.meetings?.length === 0) {
      return false;
    }
    return true; //assume the worst
  }, [p.data]);

  const editQuestion = (q: ILikertQuestionForm): Promise<IOutcomeSet> => {
    const edits: IEditLikertQuestionInput = {
      question: q.question,
      description: q.description,
      short: q.short,
      labels: q.labels,
    };
    const scaleScoringChanged =
      q.leftValue !== p.question.leftValue ||
      q.rightValue !== p.question.rightValue;
    if (!inUse && scaleScoringChanged) {
      edits.leftValue = q.leftValue;
      edits.rightValue = q.rightValue;
    }
    let prom = p.editLikertQuestion(p.QuestionSetID, p.question.id, edits);
    if (q.categoryID !== p.question.categoryID) {
      prom = prom.then(() => {
        return p.setCategory(p.QuestionSetID, p.question.id, q.categoryID);
      });
    }
    return prom;
  };

  const q = p.question;

  return (
    <LikertQuestionForm
      editing={true}
      inUse={inUse}
      values={{
        question: q.question,
        categoryID: q.categoryID,
        description: q.description,
        short: q.short,
        labels: q.labels,
        leftValue: q.leftValue,
        rightValue: q.rightValue,
      }}
      submitButtonText={t("Save changes")}
      onSubmitButtonClick={editQuestion}
      onCancel={p.OnCancel}
      {...p}
    />
  );
};

const EditLikertQuestion = isQuestionnaireInUse<IProps>(
  (p: IProps) => p.QuestionSetID
)(setCategory<IProps>(editLikertQuestion<IProps>(EditLikertQuestionInner)));
export { EditLikertQuestion };
