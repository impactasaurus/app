import React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import { useNavigator } from "redux/modules/url";
import {
  deleteQuestionSet,
  IOutcomeMutation,
} from "apollo/modules/outcomeSets";
import { GenericQuestionnaireListItem } from "components/QuestionnaireList/item";
import { QuestionnaireKey } from "models/pref";
import { useSetPreference } from "redux/modules/pref";

interface IProps extends IOutcomeMutation {
  questionnaire: IOutcomeSet;
}

const QuestionnaireItemInner = (p: IProps): JSX.Element => {
  const q = p.questionnaire;
  const setURL = useNavigator();
  const setPref = useSetPreference();

  const navigate = () => {
    setPref(QuestionnaireKey, q.id);
    setURL(`/questions/${q.id}`);
  };

  const onDelete = (): Promise<void> => {
    return p.deleteQuestionSet(q.id).then();
    // errors and success handled by ConfirmButton
  };

  const onGenLink = () => {
    setPref(QuestionnaireKey, q.id);
    setURL("/record/remote");
  };

  return (
    <GenericQuestionnaireListItem
      id={q.id}
      name={q.name}
      description={q.description}
      onDelete={onDelete}
      onNavigate={navigate}
      readOnly={q.readOnly}
      onGenLink={onGenLink}
    />
  );
};

export const QuestionnaireItem = deleteQuestionSet<IProps>(
  QuestionnaireItemInner
);
