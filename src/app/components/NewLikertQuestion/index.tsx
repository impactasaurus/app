import * as React from 'react';
import {IOutcomeSet} from 'models/outcomeSet';
import {LikertQuestionForm} from 'components/LikertQuestionForm';
import {ILikertForm, ILikertQuestionForm} from 'models/question';
import {IQuestionMutation, addLikertQuestion} from 'apollo/modules/questions';
import { useTranslation } from 'react-i18next';

interface IProps extends IQuestionMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  OnCancel: ()=>void;
  Defaults?: ILikertForm;
}

const NewLikertQuestionInner  = (p: IProps) => {

  const addQuestion = (q: ILikertQuestionForm): Promise<IOutcomeSet> => {
    return p.addLikertQuestion(p.QuestionSetID, q.question, q.leftValue, q.rightValue, q.description, q.short, q.categoryID, q.labels);
  }

  const {t} = useTranslation();
  const defaults: ILikertForm = p.Defaults || {
    leftValue: 1,
    rightValue: 5,
    labels: [],
  };
  return (
    <LikertQuestionForm
      onSubmitButtonClick={addQuestion}
      submitButtonText={t("Add")}
      onCancel={p.OnCancel}
      values={{
        ...defaults,
        question: '',
      }}
      {...p}
    />
  );
}

const NewLikertQuestion = addLikertQuestion<IProps>(NewLikertQuestionInner);

export { NewLikertQuestion };
