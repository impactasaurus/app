import * as React from "react";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { QuestionList } from "components/QuestionList";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string;
    };
  };
}

const QuestionsInner = (p: IProps) => {
  return (
    <QuestionList
      outcomeSetID={p.match.params.id}
      questionnaire={p.data.getOutcomeSet}
    />
  );
};

// t("questionnaire")
const InnerWithSpinner = ApolloLoaderHoC(
  "questionnaire",
  (p: IProps) => p.data,
  QuestionsInner
);
const InnerWithData = getOutcomeSet<IProps>((props) => props.match.params.id)(
  InnerWithSpinner
);
export const Questions = InnerWithData;
