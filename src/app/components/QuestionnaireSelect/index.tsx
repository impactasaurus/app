import React, { useEffect, useState } from "react";
import { IOutcomeResult, allOutcomeSets } from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import { usePreference, useSetPreference } from "redux/modules/pref";
import { QuestionnaireKey } from "models/pref";
import { BasicQuestionnaireSelector } from "./basic";

interface IExternalProps {
  allowedQuestionnaireIDs?: string[];
  autoSelectFirst?: boolean;
  inputID?: string;
  onBlur?: () => void;
  onQuestionnaireSelected?: (qsID: string) => void;
}

interface IProp extends IExternalProps {
  data?: IOutcomeResult;
}

export const stateInURLRegex =
  /(\/beneficiary\/[^/]*\/journey|\/beneficiary\/[^/]*$|\/beneficiary\/[^/]*\/$)/;

const isQuestionSetAllowed = (
  qsID: string,
  allowed: string[],
  discovered: IOutcomeSet[]
): boolean => {
  const isAllowed =
    Array.isArray(allowed) === false || allowed.indexOf(qsID) !== -1;
  const isKnown =
    Array.isArray(discovered) === false ||
    discovered.map((q) => q.id).indexOf(qsID) !== -1;
  return isAllowed && isKnown;
};

const QuestionSetSelectInner = (p: IProp) => {
  const setPref = useSetPreference();
  const questionnairePref = usePreference(QuestionnaireKey);

  const [selectedQuestionnaireID, setQuestionnaireID] =
    useState<string>(questionnairePref);
  const [allowedQuestionnaires, setAllowedQuestionnaires] =
    useState<IOutcomeSet[]>();

  // check questionnaire preference is allowed
  useEffect(() => {
    if (
      questionnairePref === undefined ||
      !isQuestionSetAllowed(
        questionnairePref,
        p.allowedQuestionnaireIDs,
        p.data.allOutcomeSets
      )
    ) {
      setQuestionnaireID(undefined);
      return;
    }
    setQuestionnaireID(questionnairePref);
  }, [questionnairePref, p.allowedQuestionnaireIDs, p.data.allOutcomeSets]);

  // filter questionnaires to only those allowed
  useEffect(() => {
    if (Array.isArray(p.data.allOutcomeSets) === false) {
      setAllowedQuestionnaires(undefined);
      return;
    }
    const allowed = p.data.allOutcomeSets.filter((os): boolean => {
      return isQuestionSetAllowed(
        os.id,
        p.allowedQuestionnaireIDs,
        p.data.allOutcomeSets
      );
    });
    setAllowedQuestionnaires(allowed);
  }, [p.allowedQuestionnaireIDs, p.data.allOutcomeSets]);

  // auto select logic
  useEffect(() => {
    if (
      selectedQuestionnaireID === undefined &&
      p.autoSelectFirst === true &&
      Array.isArray(allowedQuestionnaires) &&
      allowedQuestionnaires.length > 0
    ) {
      setQuestionSetID(allowedQuestionnaires[0].id);
    }
  }, [allowedQuestionnaires, selectedQuestionnaireID, p.autoSelectFirst]);

  // alert to newly selected questionnaires
  useEffect(() => {
    if (p.onQuestionnaireSelected !== undefined) {
      p.onQuestionnaireSelected(selectedQuestionnaireID);
    }
  }, [selectedQuestionnaireID]);

  const setQuestionSetID = (qID: string) => {
    setPref(QuestionnaireKey, qID);
  };

  return (
    <BasicQuestionnaireSelector
      inputID={p.inputID}
      onChange={setQuestionSetID}
      onBlur={p.onBlur}
      questionnaireID={selectedQuestionnaireID}
      allowedQuestionSetIDs={p.allowedQuestionnaireIDs}
    />
  );
};

export const QuestionnaireSelect = allOutcomeSets<IProp>(
  QuestionSetSelectInner
);
