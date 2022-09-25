import React from "react";
import { DropdownItemProps, Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import {
  IQuestionnairishProps,
  QuestionnairishType,
  QuestionnairesAndSequencesHoC,
} from "components/QuestionnairesAndSequencesHoC";

interface IProps extends IQuestionnairishProps {
  inputID?: string;
  questionnaireID?: string;
  onChange: (id: string, type: QuestionnairishType) => void;
  onBlur: () => void;
  allowedQuestionSetIDs?: string[];
  includeSequences?: boolean; // defaults to false
}

const BasicInner = (p: IProps) => {
  const { t } = useTranslation();

  const getOptions = (): DropdownItemProps[] => {
    if (p.qAndS.error) {
      return [
        {
          key: "failure",
          text: t("Failed to load questionnaires, please refresh"),
        },
      ];
    }
    const questionnaires = p?.qAndS?.items || [];
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

  const onSelect = (_, data) => {
    const selectedItem = p.qAndS.items.find((i) => i.id === data.value);
    if (!selectedItem) {
      console.error(
        "Questionnaire selector: selected an unknown questionnaire!"
      );
      return;
    }
    p.onChange(selectedItem.id, selectedItem.type);
  };

  const selectProps: any = {};
  if (p.qAndS.loading) {
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
      onChange={onSelect}
      onBlur={p.onBlur}
      options={getOptions()}
    />
  );
};

export const BasicQuestionnaireSelector = QuestionnairesAndSequencesHoC<IProps>(
  BasicInner,
  (p: IProps) => p.includeSequences === true
);
