import * as React from "react";
import { ICatalogueOS } from "models/outcomeSet";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { renderArray } from "helpers/react";
import { List } from "semantic-ui-react";
import {
  getCatalogueQuestionnaires,
  ICatalogueQuestionnaires,
} from "apollo/modules/catalogue";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ImportQuestionnaireButton } from "components/ImportQuestionnaireButton";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps extends IURLConnector {
  data: ICatalogueQuestionnaires;
}

const CatalogueQuestionnaire = (p: {
  cos: ICatalogueOS;
  onClick: () => void;
}): JSX.Element => {
  const os = p.cos.outcomeset;
  return (
    <List.Item className="questionnaire" key={os.id}>
      <List.Content floated="right">
        <ImportQuestionnaireButton
          questionnaireID={os.id}
          text={false}
          options={{ size: "tiny" }}
        />
      </List.Content>
      <List.Content onClick={p.onClick}>
        <List.Header as="a">{os.name}</List.Header>
        <List.Description as="a">{os.description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

const CatalogueInner = (p: IProps) => {
  const { t } = useTranslation();

  const navigateToQuestionnaire = (id: string) => {
    return () => p.setURL(`/catalogue/${id}`);
  };

  const renderQuestionnaire = (q: ICatalogueOS) => {
    return (
      <CatalogueQuestionnaire
        cos={q}
        onClick={navigateToQuestionnaire(q.outcomeset.id)}
      />
    );
  };

  return (
    <List divided={true} relaxed={true} verticalAlign="middle" className="list">
      {renderArray(
        renderQuestionnaire,
        p.data.getCatalogueQuestionnaires || []
      )}
      <List.Item key="morecomingsoon">
        <List.Content>
          <List.Header>{t("More Coming Soon...")}</List.Header>
        </List.Content>
      </List.Item>
    </List>
  );
};

const CatalogueInnerConnected = UrlHOC(CatalogueInner);
// t("catalogue")
const CatalogueInnerWithSpinner = ApolloLoaderHoC(
  "catalogue",
  (p: IProps) => p.data,
  CatalogueInnerConnected
);
// t('Catalogue')
const CatalogueInnerWithWrapper = PageWrapperHoC(
  "Catalogue",
  "catalogue",
  CatalogueInnerWithSpinner
);
export const Catalogue = getCatalogueQuestionnaires<IProps>(
  CatalogueInnerWithWrapper
);
