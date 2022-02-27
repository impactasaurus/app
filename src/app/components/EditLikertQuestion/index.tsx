import * as React from "react";
import {
  IQuestionMutation,
  editLikertQuestion,
} from "apollo/modules/questions";
import { IOutcomeSet } from "models/outcomeSet";
import { LikertQuestionForm } from "../LikertQuestionForm/index";
import { ILikertQuestionForm, Question } from "models/question";
import {
  ICategoryMutation,
  setCategory,
} from "../../apollo/modules/categories";
import { useTranslation } from "react-i18next";

interface IProps extends IQuestionMutation, ICategoryMutation {
  QuestionSetID: string;
  OnSuccess: () => void;
  OnCancel: () => void;
  question: Question;
}

const EditLikertQuestionInner = (p: IProps) => {
  const { t } = useTranslation();

  const editQuestion = (q: ILikertQuestionForm): Promise<IOutcomeSet> => {
    let prom = p.editLikertQuestion(
      p.QuestionSetID,
      p.question.id,
      q.question,
      q.description,
      q.short,
      q.labels
    );
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
      edit={true}
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

const EditLikertQuestion = setCategory<IProps>(
  editLikertQuestion<IProps>(EditLikertQuestionInner)
);
export { EditLikertQuestion };
