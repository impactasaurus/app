import * as React from "react";
import {
  allOutcomeSets,
  IOutcomeResult,
} from "../../apollo/modules/outcomeSets";
import { OnboardingChecklistItem } from "./item";
import { IOutcomeSet } from "models/outcomeSet";
import { getQuestions } from "helpers/questionnaire";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { TourStage, tourStageAction } from "redux/modules/tour";

interface IProps {
  data?: IOutcomeResult;
  index: number;
  minimal?: boolean; // defaults to false
}

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loading = p.data.loading;
  let completed = false;
  if (!loading && p.data.allOutcomeSets && p.data.allOutcomeSets.length > 0) {
    const maxQuestionCount = p.data.allOutcomeSets.reduce(
      (max: number, os: IOutcomeSet) => Math.max(max, getQuestions(os).length),
      0
    );
    completed = maxQuestionCount >= 3;
  }
  const onClick = () => {
    dispatch(tourStageAction(TourStage.QUESTIONNAIRE_1));
  };
  return (
    <OnboardingChecklistItem
      title={t("Define a questionnaire")}
      description={t(
        "Questionnaires are used to collect information from your beneficiaries. Create a questionnaire with 3 or more questions."
      )}
      completed={completed}
      loading={loading}
      link="/questions/new"
      index={p.index}
      minimal={p.minimal}
      onClick={onClick}
    />
  );
};

export const QuestionnaireChecklistItem = allOutcomeSets<IProps>(Inner);
