import * as React from "react";
import {
  IOutcomeResult,
  IOutcomeMutation,
  allOutcomeSets,
  deleteQuestionSet,
} from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { renderArray } from "helpers/react";
import { List, Icon, Responsive, Button } from "semantic-ui-react";
import { ConfirmButton } from "components/ConfirmButton";
import { OnboardingNewRecordHint } from "components/OnboardingNewRecordHint";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import "./style.less";
import { TourStage } from "redux/modules/tour";
import { TourPointer } from "components/TourPointer";
import RocketIcon from "./../../theme/rocket.inline.svg";

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
}

const logQuestionSetGAEvent = (action: string) => {
  ReactGA.event({
    category: "questionset",
    action,
  });
};

const NewQuestionnaireButtonID = "new-questionnaire-button";

const SettingQuestionsInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const newClicked = () => {
    p.setURL("/questions/new");
  };

  const navigateToOutcomeSet = (id: string) => {
    return () => p.setURL(`/questions/${id}`);
  };

  const deleteQS = (id: string): (() => Promise<void>) => {
    return () =>
      p.deleteQuestionSet(id).then(() => {
        logQuestionSetGAEvent("deleted");
      });
    // errors and success handled by ConfirmButton
  };

  const renderOutcomeSet = (os: IOutcomeSet): JSX.Element => (
    <List.Item className="question-set" key={os.id}>
      <List.Content floated="right">
        <ConfirmButton
          buttonProps={{ icon: true }}
          promptText={t(
            `Are you sure you want to delete the '{questionnaireName}' questionnaire?`,
            {
              questionnaireName: os.name,
            }
          )}
          onConfirm={deleteQS(os.id)}
        >
          <Icon name="delete" />
        </ConfirmButton>
      </List.Content>
      <List.Content onClick={navigateToOutcomeSet(os.id)}>
        <List.Header as="a">{os.name}</List.Header>
        {os.description && (
          <List.Description as="a">{os.description}</List.Description>
        )}
      </List.Content>
    </List.Item>
  );

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
          as={Button}
          maxWidth={1199}
          icon="plus"
          primary={true}
          onClick={newClicked}
          id={NewQuestionnaireButtonID}
        />
      </span>
      <h1 key="title">{t("Questionnaires")}</h1>
      <OnboardingNewRecordHint />
      <List
        divided={true}
        relaxed={true}
        verticalAlign="middle"
        className="list"
      >
        {renderArray(renderOutcomeSet, p.data.allOutcomeSets)}
        {p.data.allOutcomeSets.length === 0 && (
          <div>
            <RocketIcon style={{ marginRight: "0.5em" }} />
            <a onClick={newClicked}>
              {t("Get started by creating a questionnaire")}
            </a>
          </div>
        )}
      </List>
      <TourPointer
        content={t("test")}
        stage={TourStage.QUESTIONNAIRE_2}
        target={`#${NewQuestionnaireButtonID}`}
        transitionOnUnmount={TourStage.QUESTIONNAIRE_3}
      />
    </div>
  );
};

const OutcomeSetsConnected = UrlHOC(SettingQuestionsInner);
// t("questionnaires")
const OutcomeSetsLoader = ApolloLoaderHoC(
  "questionnaires",
  (p: IProps) => p.data,
  OutcomeSetsConnected
);
const OutcomeSetsWithData = allOutcomeSets<IProps>(
  deleteQuestionSet(OutcomeSetsLoader)
);
// t("Questionnaires")
const OutcomeSets = MinimalPageWrapperHoC(
  "Questionnaires",
  "question-sets",
  OutcomeSetsWithData
);
export { OutcomeSets };
