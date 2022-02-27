import * as React from "react";
import { QuestionCategoryForm } from "../QuestionCategoryForm";
import {
  ICategoryMutation,
  addQuestionCategory,
} from "apollo/modules/categories";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  OnSuccess: () => void;
  OnCancel: () => void;
}

const NewQuestionCategoryInner = (p: IProps) => {
  const { t } = useTranslation();

  const onSubmitButtonPress = (
    name: string,
    aggregation: string,
    description: string
  ): Promise<IOutcomeSet> => {
    return p.addCategory(p.QuestionSetID, name, aggregation, description);
  };

  return (
    <QuestionCategoryForm
      OnSuccess={p.OnSuccess}
      OnCancel={p.OnCancel}
      onSubmitButtonPress={onSubmitButtonPress}
      submitButtonText={t("Add")}
    />
  );
};

const NewQuestionCategory = addQuestionCategory<IProps>(
  NewQuestionCategoryInner
);
export { NewQuestionCategory };
