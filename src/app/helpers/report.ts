import { IOutcomeSet } from "../models/outcomeSet";
import { IExcluded, IExclusion } from "../models/report";
import { isNullOrUndefined } from "util";
import {
  getCategoryFriendlyName,
  getQuestionFriendlyName,
} from "./questionnaire";
import { stringify } from "querystring";

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

export function constructReportQueryParams(
  tags: string[],
  open?: boolean,
  orTags?: boolean
): string {
  const params: any = {};
  if (Array.isArray(tags) && tags.length > 0) {
    params.tags = JSON.stringify(tags);
  }
  if (!isNullOrUndefined(open)) {
    params.open = open;
  }
  if (!isNullOrUndefined(orTags)) {
    params.or = orTags;
  }
  return "?" + stringify(params);
}

export function constructReportURL(
  reportType: string,
  start: Date,
  end: Date,
  questionnaire: string
): string {
  const encodeDatePathParam = (d: Date): string => {
    // had lots of issues with full stops being present in path parameters...
    return d.toISOString().replace(/\.[0-9]{3}/, "");
  };
  const s = encodeDatePathParam(start);
  const e = encodeDatePathParam(end);
  return `/report/${reportType}/${questionnaire}/${s}/${e}`;
}
