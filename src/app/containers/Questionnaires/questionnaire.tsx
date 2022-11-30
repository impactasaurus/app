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
import { useTranslation } from "react-i18next";
import { sanitiseGraphQLError } from "helpers/apollo";

interface IProps extends IOutcomeMutation {
  questionnaire: IOutcomeSet;
}

const QuestionnaireItemInner = (p: IProps): JSX.Element => {
  const q = p.questionnaire;
  const setURL = useNavigator();
  const setPref = useSetPreference();
  const { t } = useTranslation();

  const navigate = () => {
    setPref(QuestionnaireKey, q.id);
    setURL(`/questions/${q.id}`);
  };

  const onDelete = (): Promise<void> => {
    return p
      .deleteQuestionSet(q.id)
      .then<void>()
      .catch((e: Error) => {
        const message = sanitiseGraphQLError(e.message);
        if (message.indexOf("within the following sequences:") !== -1) {
          const sequences = message.split(":")[1].trim();
          throw Error(
            t(
              "Cannot delete questionnaire as it is used in the following sequences: {sequences}",
              { sequences }
            )
          );
        }
        throw Error(message);
      });
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
