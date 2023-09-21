import { IOutcomeSet } from "../models/outcomeSet";
import { IExclusion } from "../models/report";
import { isNullOrUndefined } from "util";
import {
  getCategoryFriendlyName,
  getQuestionFriendlyName,
} from "./questionnaire";
import { IExcluded } from "components/ReportDetails";

function getCategoryWarnings(
  exclusions: IExclusion[],
  qs: IOutcomeSet
): string[] {
  return exclusions
    .filter(
      (e) => !isNullOrUndefined(e.category) && !isNullOrUndefined(e.beneficiary)
    )
    .map((e) => {
      const catIdentifier = getCategoryFriendlyName(e.category, qs);
      return `Beneficiary '${e.beneficiary}' category '${catIdentifier}': ${e.reason}`;
    });
}

function getQuestionWarnings(
  exclusions: IExclusion[],
  qs: IOutcomeSet
): string[] {
  return exclusions
    .filter(
      (e) => !isNullOrUndefined(e.question) && !isNullOrUndefined(e.beneficiary)
    )
    .map((e) => {
      const questionIdentifier = getQuestionFriendlyName(e.question, qs);
      return `Beneficiary '${e.beneficiary}' question '${questionIdentifier}': ${e.reason}`;
    });
}

export function getWarnings(
  exclusions: IExclusion[],
  qs: IOutcomeSet
): string[] {
  let warns = [];
  warns = warns.concat(getQuestionWarnings(exclusions, qs));
  warns = warns.concat(getCategoryWarnings(exclusions, qs));
  return warns;
}

export function getExcluded(excluded: IExclusion[]): IExcluded {
  return excluded.reduce(
    (agg: IExcluded, e: IExclusion) => {
      const b = !isNullOrUndefined(e.beneficiary);
      const q = !isNullOrUndefined(e.question);
      const c = !isNullOrUndefined(e.category);
      if (b && !q && !c) {
        agg.beneficiaryIDs.push(e.beneficiary);
      }
      if (q && !b && !c) {
        agg.questionIDs.push(e.question);
      }
      if (c && !b && !q) {
        agg.categoryIDs.push(e.category);
      }
      return agg;
    },
    {
      categoryIDs: [],
      questionIDs: [],
      beneficiaryIDs: [],
    }
  );
}
