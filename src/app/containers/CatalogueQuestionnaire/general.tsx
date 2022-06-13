import * as React from "react";
import {
  getCatalogueQuestionnaire,
  ICatalogueQuestionnaire,
} from "apollo/modules/catalogue";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { QuestionnaireGeneral } from "components/QuestionnaireGeneral";

interface IProps {
  data: ICatalogueQuestionnaire;
  match: {
    params: {
      id: string;
    };
  };
}

const GeneralReadOnlyForm = (p: IProps) => {
  if (!p.data.getCatalogueQuestionnaire) {
    return <div />;
  }
  return (
    <QuestionnaireGeneral
      questionnaire={p.data.getCatalogueQuestionnaire?.outcomeset}
      attribution={p.data.getCatalogueQuestionnaire?.attribution}
      license={p.data.getCatalogueQuestionnaire?.license}
    />
  );
};

// t("questionnaire")
const GeneralInner = ApolloLoaderHoC<IProps>(
  "questionnaire",
  (p: IProps) => p.data,
  GeneralReadOnlyForm
);

export const General = getCatalogueQuestionnaire<IProps>(
  (props) => props.match.params.id
)(GeneralInner);
