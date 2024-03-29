import React, { useState } from "react";
import { BasicQuestionnaireSelector } from "./basic";
import { QuestionnairishType } from "components/QuestionnairesAndSequencesHoC";
import { usePreference, useSetPreference } from "redux/modules/pref";
import { QuestionnaireKey } from "models/pref";
import { useLocation } from "react-router";

interface IProp {
  allowedQuestionnaireIDs?: string[];
  autoSelectFirst?: boolean;
  inputID?: string;
  onBlur?: () => void;
  onQuestionnaireSelected?: (id: string, type: QuestionnairishType) => void;
  includeSequences?: boolean; // defaults to false
}

const getURLOverride = (search: string): string | undefined => {
  try {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("q")) {
      return urlParams.get("q");
    }
  } catch {}
  return undefined;
};

export const QuestionnaireSelect = (p: IProp): JSX.Element => {
  const questionnairePref = usePreference(QuestionnaireKey);
  const setPref = useSetPreference();
  const { search } = useLocation();

  const [selected, setSelected] = useState<string>(
    getURLOverride(search) || questionnairePref
  );
  const onSelect = (id: string, type: QuestionnairishType) => {
    setSelected(id);
    setPref(QuestionnaireKey, id);
    if (p.onQuestionnaireSelected) {
      p.onQuestionnaireSelected(id, type);
    }
  };

  return (
    <BasicQuestionnaireSelector
      inputID={p.inputID}
      onChange={onSelect}
      onBlur={p.onBlur}
      allowedQuestionnaireIDs={p.allowedQuestionnaireIDs}
      includeSequences={p.includeSequences}
      autoSelectFirst={p.autoSelectFirst}
      questionnaireID={selected}
    />
  );
};
