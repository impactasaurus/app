import {
  IAnswerDelta,
  IBenDeltaSummary,
  IBeneficiaryDeltaReport,
} from "models/report";
import { IOutcomeSet } from "models/outcomeSet";
import {
  getCategoryFriendlyName,
  getQuestionFriendlyName,
  getQuestions,
} from "helpers/questionnaire";

export interface IDelta {
  id: string;
  label: string;
  category: boolean;
  decreased: number;
  same: number;
  increased: number;
}

const answerDifferences = (
  id: string,
  category: boolean,
  bens: IBenDeltaSummary[]
): number[] => {
  return bens.reduce((deltas: number[], ben: IBenDeltaSummary): number[] => {
    const answers = category ? ben.categories : ben.questions;
    const answer = answers.find((a: IAnswerDelta) => a.aID === id);
    if (answer === undefined) {
      return deltas;
    }
    return deltas.concat(answer.stats.delta);
  }, []);
};

const categorisedDeltas = (
  id: string,
  category: boolean,
  bens: IBenDeltaSummary[],
  questionnaire: IOutcomeSet
): IDelta => {
  const label = category
    ? getCategoryFriendlyName(id, questionnaire)
    : getQuestionFriendlyName(id, questionnaire);
  const deltas = answerDifferences(id, category, bens);
  return deltas.reduce<IDelta>(
    (categorised: IDelta, delta: number): IDelta => {
      if (delta < 0) {
        categorised.decreased++;
      } else if (delta === 0) {
        categorised.same++;
      } else {
        categorised.increased++;
      }
      return categorised;
    },
    {
      decreased: 0,
      same: 0,
      increased: 0,
      category,
      id,
      label,
    }
  );
};

export const extractDeltas = (
  category: boolean,
  report: IBeneficiaryDeltaReport,
  questionnaire: IOutcomeSet
): IDelta[] => {
  const ids = category
    ? questionnaire.categories.map((c) => c.id)
    : getQuestions(questionnaire).map((q) => q.id);
  return ids.map((id) =>
    categorisedDeltas(id, category, report.beneficiaries, questionnaire)
  );
};
