import React, { useEffect, useState } from "react";
import { usePreference, useSetPreference } from "redux/modules/pref";
import { QuestionnaireKey } from "models/pref";
import { BasicQuestionnaireSelector } from "./basic";
import {
  IQuestionnairish,
  IQuestionnairishProps,
  QuestionnairishType,
  QuestionnairesAndSequencesHoC,
} from "components/QuestionnairesAndSequencesHoC";

interface IExternalProps {
  allowedQuestionnaireIDs?: string[];
  autoSelectFirst?: boolean;
  inputID?: string;
  onBlur?: () => void;
  onQuestionnaireSelected?: (qsID: string, type: QuestionnairishType) => void;
  includeSequences?: boolean; // defaults to false
}

interface IProp extends IExternalProps, IQuestionnairishProps {}

export const stateInURLRegex =
  /(\/beneficiary\/[^/]*\/journey|\/beneficiary\/[^/]*$|\/beneficiary\/[^/]*\/$)/;

const isQuestionSetAllowed = (
  qsID: string,
  allowed: string[],
  discovered: IQuestionnairish[]
): boolean => {
  const isAllowed =
    Array.isArray(allowed) === false || allowed.indexOf(qsID) !== -1;
  const isKnown =
    Array.isArray(discovered) === false ||
    discovered.map((i) => i.id).indexOf(qsID) !== -1;
  return isAllowed && isKnown;
};

const QuestionSetSelectInner = (p: IProp) => {
  const setPref = useSetPreference();
  const questionnairePref = usePreference(QuestionnaireKey);

  const [selectedQuestionnaireID, setQuestionnaireID] =
    useState<string>(questionnairePref);
  const [allowedQuestionnaires, setAllowedQuestionnaires] =
    useState<string[]>();

  const setQuestionSetID = (qID: string) => setPref(QuestionnaireKey, qID);

  // check questionnaire preference is allowed
  useEffect(() => {
    if (
      questionnairePref === undefined ||
      !isQuestionSetAllowed(
        questionnairePref,
        p.allowedQuestionnaireIDs,
        p.qAndS.items
      )
    ) {
      setQuestionnaireID(undefined);
      return;
    }
    setQuestionnaireID(questionnairePref);
  }, [questionnairePref, p.allowedQuestionnaireIDs, p.qAndS.items]);

  // filter questionnaires to only those allowed
  useEffect(() => {
    if (Array.isArray(p.qAndS.items) === false) {
      setAllowedQuestionnaires(undefined);
      return;
    }
    const allowed = p.qAndS.items.filter((os): boolean => {
      return isQuestionSetAllowed(
        os.id,
        p.allowedQuestionnaireIDs,
        p.qAndS.items
      );
    });
    setAllowedQuestionnaires(allowed.map((i) => i.id));
  }, [p.allowedQuestionnaireIDs, p.qAndS.items]);

  // auto select logic
  useEffect(() => {
    if (
      selectedQuestionnaireID === undefined &&
      p.autoSelectFirst === true &&
      Array.isArray(allowedQuestionnaires) &&
      allowedQuestionnaires.length > 0
    ) {
      setQuestionSetID(allowedQuestionnaires[0]);
    }
  }, [allowedQuestionnaires, selectedQuestionnaireID, p.autoSelectFirst]);

  // alert to newly selected questionnaires
  useEffect(() => {
    if (!p.onQuestionnaireSelected) {
      return;
    }
    if (!selectedQuestionnaireID) {
      // undefined is a valid selection
      p.onQuestionnaireSelected(undefined, undefined);
      return;
    }
    const selectedItem = (p.qAndS.items || []).find(
      (i) => i.id === selectedQuestionnaireID
    );
    if (!selectedItem) {
      return;
    }
    p.onQuestionnaireSelected(selectedItem.id, selectedItem.type);
  }, [selectedQuestionnaireID, p.qAndS.items, p.onQuestionnaireSelected]);

  return (
    <BasicQuestionnaireSelector
      inputID={p.inputID}
      onChange={setQuestionSetID}
      onBlur={p.onBlur}
      questionnaireID={selectedQuestionnaireID}
      allowedQuestionSetIDs={p.allowedQuestionnaireIDs}
      includeSequences={p.includeSequences}
    />
  );
};

export const QuestionnaireSelect = QuestionnairesAndSequencesHoC<IProp>(
  QuestionSetSelectInner,
  (p: IProp) => p.includeSequences
);
