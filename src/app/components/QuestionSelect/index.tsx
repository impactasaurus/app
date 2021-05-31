import React from "react";
import {
  DropdownItemProps,
  DropdownProps,
  Select,
  SelectProps,
} from "semantic-ui-react";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { useTranslation } from "react-i18next";
import { getQuestionFriendlyName, getQuestions } from "helpers/questionnaire";

interface IProp {
  questionnaireID: string;
  questionID?: string;
  onChange: (qID: string) => void;
  onBlur?: () => void;
  inputID?: string;
  data?: IOutcomeResult;
}

const QuestionSelectInner = (p: IProp) => {
  const { t } = useTranslation();

  const setQuestionID = (_, data: DropdownProps) => {
    p.onChange(data.value as string);
  };

  const getOptions = (): DropdownItemProps[] => {
    if (p.data.loading || p.data.error || !p.data.getOutcomeSet) {
      return [];
    }
    const qq = getQuestions(p.data.getOutcomeSet);
    return qq.map((q) => {
      return {
        key: q.id,
        value: q.id,
        text: getQuestionFriendlyName(q.id, p.data.getOutcomeSet, true),
      };
    });
  };

  const selectProps: Partial<SelectProps> = {};
  if (p.data.loading) {
    selectProps.loading = true;
    selectProps.disabled = true;
  }
  if (p.data.error) {
    selectProps.disabled = true;
    selectProps.error = true;
  }

  return (
    <Select
      id={p.inputID}
      className="qs-selector"
      {...selectProps}
      value={p.questionID}
      placeholder={t("Question")}
      onChange={setQuestionID}
      onBlur={p.onBlur}
      options={getOptions()}
    />
  );
};

export const QuestionSelect = getOutcomeSet<IProp>((p) => p.questionnaireID)(
  QuestionSelectInner
);
