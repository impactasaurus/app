import * as React from "react";
import { IOutcomeResult, allOutcomeSets } from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import { useNavigator } from "redux/modules/url";
import { useTranslation } from "react-i18next";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import RocketIcon from "./../../theme/rocket.inline.svg";
import {
  IntroduceNewQuestionnaireButton,
  WhatNextAfterQuestionnaireTour,
} from "components/TourQuestionnaires";
import { QuestionnaireItem } from "./questionnaire";
import { GenericQuestionnaireList } from "components/QuestionnaireList";

interface IProps {
  data: IOutcomeResult;
}

const NewQuestionnaireButtonID = "new-questionnaire-button";

const Inner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const setURL = useNavigator();

  const newClicked = () => {
    setURL("/questions/new");
  };

  const renderItem = (i: IOutcomeSet) => (
    <QuestionnaireItem questionnaire={i} />
  );

  return (
    <GenericQuestionnaireList
      items={p.data.allOutcomeSets}
      renderItem={renderItem}
      newClicked={newClicked}
      text={{
        title: t("Questionnaires"),
        newButton: t("New Questionnaire"),
      }}
      newButtonID={NewQuestionnaireButtonID}
      beforeList={<WhatNextAfterQuestionnaireTour />}
      afterList={
        <IntroduceNewQuestionnaireButton id={NewQuestionnaireButtonID} />
      }
      emptyList={
        <div>
          <RocketIcon style={{ marginRight: "0.5em" }} />
          <a onClick={newClicked}>
            {t("Get started by creating a questionnaire")}
          </a>
        </div>
      }
    />
  );
};

// t("questionnaires")
const WithLoader = ApolloLoaderHoC(
  "questionnaires",
  (p: IProps) => p.data,
  Inner
);
const WithData = allOutcomeSets<IProps>(WithLoader);
// t("Questionnaires")
export const Questionnaires = MinimalPageWrapperHoC(
  "Questionnaires",
  "question-sets",
  WithData
);
