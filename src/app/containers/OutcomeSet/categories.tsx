import * as React from "react";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { CategoryList } from "components/CategoryList";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string;
    };
  };
}

const CategoriesInner = (p: IProps) => {
  return (
    <div>
      <CategoryList
        outcomeSetID={p.match.params.id}
        questionnaire={p.data.getOutcomeSet}
        readOnly={p.data.getOutcomeSet?.readOnly}
      />
    </div>
  );
};

// t("questionnaire")
const InnerWithSpinner = ApolloLoaderHoC(
  "questionnaire",
  (p: IProps) => p.data,
  CategoriesInner
);
const InnerWithData = getOutcomeSet<IProps>((props) => props.match.params.id)(
  InnerWithSpinner
);
export const Categories = InnerWithData;
