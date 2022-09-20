import {
  deleteQuestionSet,
  IOutcomeMutation,
} from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import React from "react";
import { useNavigator } from "redux/modules/url";
import { Item } from "./item";

interface IProps extends IOutcomeMutation {
  questionnaire: IOutcomeSet;
}

const QuestionnaireItemInner = (p: IProps): JSX.Element => {
  const q = p.questionnaire;
  const setURL = useNavigator();

  const navigate = () => {
    setURL(`/questions/${q.id}`);
  };

  const onDelete = (): Promise<void> => {
    return p.deleteQuestionSet(q.id).then();
    // errors and success handled by ConfirmButton
  };

  return (
    <Item
      id={q.id}
      name={q.name}
      description={q.description}
      onDelete={onDelete}
      onNavigate={navigate}
    />
  );
};

export const QuestionnaireItem = deleteQuestionSet<IProps>(
  QuestionnaireItemInner
);
