import React, { useEffect, useState } from "react";
import { DropdownItemProps, Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import {
  IQuestionnairishProps,
  QuestionnairishType,
  QuestionnairesAndSequencesHoC,
  IQuestionnairish,
} from "components/QuestionnairesAndSequencesHoC";

interface IProps {
  inputID?: string;
  questionnaireID?: string;
  onChange?: (id: string, type: QuestionnairishType) => void;
  onBlur?: () => void;
  allowedQuestionnaireIDs?: string[];
  includeSequences?: boolean; // defaults to false
  autoSelectFirst?: boolean; // defaults to false
}

const getAllowedQuestionnaires = (
  qq: IQuestionnairish[],
  allowed: string[]
): IQuestionnairish[] => {
  const questionnaires = qq || [];
  return questionnaires.filter(
    (q) => !Array.isArray(allowed) || allowed.indexOf(q.id) !== -1
  );
};

const BasicInner = (p: IProps & IQuestionnairishProps) => {
  const { t } = useTranslation();

  const [options, setOptions] = useState<DropdownItemProps[]>([]);
  const [allowed, setAllowed] = useState<IQuestionnairish[]>();
  const [selected, setSelectedInner] = useState<string>();

  const setSelected = (q: IQuestionnairish) => {
    if (q?.id && q.id === selected) {
      return;
    }
    setSelectedInner(q?.id);
    if (p.onChange) {
      p.onChange(q?.id, q?.type);
    }
  };

  // filter to allowed questionnairish items
  useEffect(() => {
    setAllowed(
      getAllowedQuestionnaires(p.qAndS?.items, p.allowedQuestionnaireIDs)
    );
  }, [p.qAndS.items, p.allowedQuestionnaireIDs]);

  // don't allow selection of disallowed or unknown questionnaires
  useEffect(() => {
    if (!Array.isArray(allowed)) {
      return;
    }
    if (p.questionnaireID) {
      const next = allowed.find((q) => q.id == p.questionnaireID);
      if (next) {
        setSelected(next);
        return;
      }
    }
    if (p.autoSelectFirst === true && allowed.length > 0) {
      setSelected(allowed[0]);
      return;
    }
  }, [p.questionnaireID, allowed, p.autoSelectFirst]);

  // cache dropdown items
  useEffect(() => {
    if (p.qAndS.error) {
      setOptions([
        {
          key: "failure",
          text: t("Failed to load questionnaires, please refresh"),
        },
      ]);
    } else {
      setOptions(
        (allowed || []).map((q) => ({
          key: q.id,
          value: q.id,
          text: q.name,
        }))
      );
    }
  }, [p.qAndS.error, allowed]);

  const onSelect = (_, data) => {
    const selectedItem = (allowed || []).find((i) => i.id === data.value);
    if (!selectedItem) {
      console.error(
        "Questionnaire selector: selected an unknown questionnaire!"
      );
      return;
    }
    setSelected(selectedItem);
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
      value={selected}
      placeholder={t("Questionnaire")}
      onChange={onSelect}
      onBlur={p.onBlur}
      options={options}
    />
  );
};

export const BasicQuestionnaireSelector = QuestionnairesAndSequencesHoC<
  IProps & IQuestionnairishProps
>(BasicInner, (p: IProps) => p.includeSequences === true);
