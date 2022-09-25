import React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import { useNavigator } from "redux/modules/url";
import {
  deleteQuestionSet,
  IOutcomeMutation,
} from "apollo/modules/outcomeSets";
import { GenericQuestionnaireListItem } from "components/QuestionnaireList/item";

interface IProps extends IOutcomeMutation {
  questionnaire: IOutcomeSet;
}

const QuestionnaireItemInner = (p: IProps): JSX.Element => {
  const q = p.questionnaire;
  const setURL = useNavigator();

  const navigate = () => setURL(`/questions/${q.id}`);

  const onDelete = (): Promise<void> => {
    return p.deleteQuestionSet(q.id).then();
    // errors and success handled by ConfirmButton
  };

  return (
    <GenericQuestionnaireListItem
      id={q.id}
      name={q.name}
      description={q.description}
      onDelete={onDelete}
      onNavigate={navigate}
      readOnly={q.readOnly}
    />
  );
};

export const QuestionnaireItem = deleteQuestionSet<IProps>(
  QuestionnaireItemInner
);
