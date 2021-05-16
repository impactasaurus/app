import React, { useState } from "react";
import {
  Button,
  ButtonProps,
  Popup,
  Icon,
  SemanticICONS,
} from "semantic-ui-react";
import {
  ICatalogueImport,
  importQuestionnaire,
} from "../../apollo/modules/catalogue";
import { IURLConnector, UrlHOC } from "../../redux/modules/url";
import { useTranslation } from "react-i18next";

interface IProps extends ICatalogueImport, IURLConnector {
  questionnaireID: string;
  text?: boolean; // defaults true
  options?: ButtonProps;
}

const Inner = (p: IProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const importQuestionnaire = () => {
    setLoading(true);
    setError(false);
    p.importQuestionnaire(p.questionnaireID)
      .then(() => {
        p.setURL("/questions");
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  const options: ButtonProps = { ...p.options };
  let icon: SemanticICONS = "add";
  const text = t("Add to your questionnaires");
  let popup = text;
  if (error) {
    options.color = "red";
    icon = "close";
    popup = t("Failed to import");
  } else {
    options.primary = true;
  }
  if (p.text) {
    options.children = (
      <span>
        <Icon name={icon} />
        {text}
      </span>
    );
  } else {
    options.icon = icon;
  }
  return (
    <Popup
      content={popup}
      trigger={
        <Button onClick={importQuestionnaire} loading={loading} {...options} />
      }
    />
  );
};

const InnerConnected = UrlHOC(Inner);
export const ImportQuestionnaireButton =
  importQuestionnaire<IProps>(InnerConnected);
