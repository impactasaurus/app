import * as React from "react";
import {
  IOutcomeResult,
  IOutcomeMutation,
  allOutcomeSets,
} from "apollo/modules/outcomeSets";
import { instanceOfIOutcomeSet, IOutcomeSet } from "models/outcomeSet";
import { useNavigator } from "redux/modules/url";
import { renderArray } from "helpers/react";
import { List, Responsive, Button } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { ApolloLoadersHoC } from "components/ApolloLoaderHoC";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import RocketIcon from "./../../theme/rocket.inline.svg";
import {
  IntroduceNewQuestionnaireButton,
  WhatNextAfterQuestionnaireTour,
} from "components/TourQuestionnaires";
import { TooltipButton } from "components/TooltipButton";
import { getSequences, IGetSequences } from "apollo/modules/sequence";
import "./style.less";
import { ISequence } from "models/sequence";
import { QuestionnaireItem } from "./questionnaire";
import { SequenceItem } from "./sequence";

interface IProps extends IOutcomeMutation {
  data: IOutcomeResult;
  seq: IGetSequences;
}

const NewQuestionnaireButtonID = "new-questionnaire-button";

const SettingQuestionsInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const setURL = useNavigator();
  const combined = [...p.data.allOutcomeSets, ...p.seq.sequences];
  combined.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const newClicked = () => {
    setURL("/questions/new");
  };

  const renderItem = (i: IOutcomeSet | ISequence): JSX.Element => {
    return instanceOfIOutcomeSet(i) ? (
      <QuestionnaireItem questionnaire={i} />
    ) : (
      <SequenceItem sequence={i} />
    );
  };

  return (
    <div>
      <span className="title-holder">
        <Responsive
          as={Button}
          minWidth={1200}
          icon="plus"
          content={t("New Questionnaire")}
          primary={true}
          onClick={newClicked}
          id={NewQuestionnaireButtonID}
        />
        <Responsive
          as={TooltipButton}
          maxWidth={1199}
          buttonProps={{
            icon: "plus",
            primary: true,
            onClick: newClicked,
            id: NewQuestionnaireButtonID,
          }}
          tooltipContent={t("New Questionnaire")}
        />
      </span>
      <h1 key="title">{t("Questionnaires")}</h1>
      <WhatNextAfterQuestionnaireTour />
      <List
        divided={true}
        relaxed={true}
        verticalAlign="middle"
        className="list"
      >
        {renderArray(
          renderItem,
          combined,
          <div>
            <RocketIcon style={{ marginRight: "0.5em" }} />
            <a onClick={newClicked}>
              {t("Get started by creating a questionnaire")}
            </a>
          </div>
        )}
      </List>
      <IntroduceNewQuestionnaireButton id={NewQuestionnaireButtonID} />
    </div>
  );
};

// t("questionnaires")
// t("sequences")
const OutcomeSetsLoader = ApolloLoadersHoC(
  [
    {
      entity: "questionnaires",
      queryProps: (p: IProps) => p.data,
    },
    {
      entity: "sequences",
      queryProps: (p: IProps) => p.seq,
    },
  ],
  SettingQuestionsInner
);
const OutcomeSetsWithData = allOutcomeSets<IProps>(
  getSequences(OutcomeSetsLoader, "seq")
);
// t("Questionnaires")
const OutcomeSets = MinimalPageWrapperHoC(
  "Questionnaires",
  "question-sets",
  OutcomeSetsWithData
);
export { OutcomeSets };
