import React from "react";
import { allOutcomeSets, IOutcomeResult } from "apollo/modules/outcomeSets";
import { DropdownItemProps, Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

interface IProps {
  inputID?: string;
  questionnaireID?: string;
  onChange: (id: string) => void;
  onBlur: () => void;
  allowedQuestionSetIDs?: string[];

  data?: IOutcomeResult;
}

const BasicInner = (p: IProps) => {
  const { t } = useTranslation();

  const getOptions = (): DropdownItemProps[] => {
    const questionnaires = p?.data?.allOutcomeSets || [];
    const filtered = questionnaires.filter(
      (q) =>
        !Array.isArray(p.allowedQuestionSetIDs) ||
        p.allowedQuestionSetIDs.indexOf(q.id) !== -1
    );
    return filtered.map((q) => {
      return {
        key: q.id,
        value: q.id,
        text: q.name,
      };
    });
  };

  const selectProps: any = {};
  if (p.data.loading) {
    selectProps.loading = true;
    selectProps.disabled = true;
  }

  return (
    <Select
      id={p.inputID}
      className="qs-selector"
      {...selectProps}
      value={p.questionnaireID}
      placeholder={t("Questionnaire")}
      onChange={(_, data) => p.onChange(data.value as string)}
      onBlur={p.onBlur}
      options={getOptions()}
    />
  );
};

export const BasicQuestionnaireSelector = allOutcomeSets<IProps>(BasicInner);
