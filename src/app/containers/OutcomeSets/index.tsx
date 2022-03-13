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
import { List, Icon } from "semantic-ui-react";
import { ConfirmButton } from "components/ConfirmButton";
import { OnboardingNewRecordHint } from "components/OnboardingNewRecordHint";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import "./style.less";

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
}

const logQuestionSetGAEvent = (action: string) => {
  ReactGA.event({
    category: "questionset",
    action,
  });
};

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
      <OnboardingNewRecordHint />
      <List
        divided={true}
        relaxed={true}
        verticalAlign="middle"
        className="list"
      >
        {renderArray(renderOutcomeSet, p.data.allOutcomeSets)}
        <List.Item className="new-control" key="new">
          <List.Content onClick={newClicked}>
            <List.Header as="a">{t("New Questionnaire")}</List.Header>
          </List.Content>
        </List.Item>
      </List>
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
const OutcomeSets = PageWrapperHoC(
  "Questionnaires",
  "question-sets",
  OutcomeSetsWithData
);
export { OutcomeSets };
