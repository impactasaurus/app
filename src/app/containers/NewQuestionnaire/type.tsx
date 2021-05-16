import React, { useState } from "react";
import { Item, MultiChoice } from "components/MultiChoice";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { Segment, Loader, Button } from "semantic-ui-react";
import {
  ICatalogueImport,
  importQuestionnaire,
} from "../../apollo/modules/catalogue";
import {
  allOutcomeSets,
  IOutcomeResult,
} from "../../apollo/modules/outcomeSets";
import RocketIcon from "./../../theme/rocket.inline.svg";
import { useTranslation } from "react-i18next";

interface IProps extends ICatalogueImport, IURLConnector {
  data?: IOutcomeResult;
}

const NewQuestionnaireTypSelectionInner = (p: IProps) => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const goToCatalogue = () => {
    p.setURL(`/catalogue`);
  };

  const goToCustom = () => {
    p.setURL(`/questions/new/custom`);
  };

  const quickStart = () => {
    setImporting(true);
    setError(false);
    p.importQuestionnaire("eac0c7b4-c9af-4475-94b8-72c548ea9588")
      .then(() => {
        p.setURL("/questions");
      })
      .catch(() => {
        setImporting(false);
        setError(true);
      });
  };

  const renderQuickStart = (data: IOutcomeResult) => {
    if (
      data.loading !== false ||
      (data.allOutcomeSets && data.allOutcomeSets.length < 0)
    ) {
      return <div key="noQuickStart" />;
    }
    let body: JSX.Element | JSX.Element[] = (
      <Button primary={true} onClick={quickStart}>
        {t("Add the ONS Wellbeing questionnaire")}
      </Button>
    );
    if (importing) {
      body = <Loader active={true} inline={true} size="mini" />;
    }
    if (error) {
      body = [
        <p key="whoops">{t("Whoops, something went wrong.")}</p>,
        <p key="advice">
          {t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </p>,
      ];
    }
    return (
      <Segment
        key="quickStart"
        id="quick-start"
        raised={true}
        compact={true}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <h3 style={{ fontWeight: "normal" }}>
          <RocketIcon style={{ width: "1rem", marginRight: ".3rem" }} />
          {t("Quick start")}
        </h3>
        {body}
      </Segment>
    );
  };

  const items: Item[] = [
    {
      title: t("Custom"),
      subtitle: t("Create your own questionnaire"),
      onClick: goToCustom,
    },
    {
      title: t("Catalogue"),
      subtitle: t("Select a questionnaire from the literature"),
      onClick: goToCatalogue,
    },
  ];
  return (
    <>
      {renderQuickStart(p.data)}
      <MultiChoice key="choice" items={items} />
    </>
  );
};

const NewQuestionnaireTypSelectionConnected = UrlHOC(
  NewQuestionnaireTypSelectionInner
);
const NewQuestionnaireTypSelectionWithData = allOutcomeSets(
  importQuestionnaire<IProps>(NewQuestionnaireTypSelectionConnected)
);

// t('New Questionnaire')
export const NewQuestionnaireTypeSelector = PageWrapperHoC(
  "New Questionnaire",
  "new-questionnaire",
  NewQuestionnaireTypSelectionWithData
);
