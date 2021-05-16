import * as React from "react";
import { QuestionCategoryForm } from "../QuestionCategoryForm";
import {
  ICategoryMutation,
  editQuestionCategory,
} from "apollo/modules/categories";
import { ICategory } from "models/category";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  category: ICategory;
  OnSuccess: () => void;
  OnCancel: () => void;
}

const EditQuestionCategoryInner = (p: IProps) => {
  const onSubmitButtonPress = (
    name: string,
    aggregation: string,
    description: string
  ): Promise<IOutcomeSet> => {
    return p.editCategory(
      p.QuestionSetID,
      p.category.id,
      name,
      aggregation,
      description
    );
  };

  const { t } = useTranslation();
  return (
    <QuestionCategoryForm
      OnSuccess={p.OnSuccess}
      OnCancel={p.OnCancel}
      onSubmitButtonPress={onSubmitButtonPress}
      submitButtonText={t("Save changes")}
      values={{
        name: p.category.name,
        description: p.category.description,
        aggregation: p.category.aggregation,
      }}
    />
  );
};

const EditQuestionCategory = editQuestionCategory<IProps>(
  EditQuestionCategoryInner
);
export { EditQuestionCategory };
