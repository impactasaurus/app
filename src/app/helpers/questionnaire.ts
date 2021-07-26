import { IOutcomeSet } from "../models/outcomeSet";
import { IQuestion, Question } from "models/question";
import { ICategory } from "../models/category";
import { isNullOrUndefined } from "util";

function aggregate(values: number[], aggregation: string): number {
  if (values.length === 0) {
    return 0;
  }
  const sum = values.reduce((s, v) => s + v, 0);
  if (aggregation === "sum") {
    return sum;
  }
  return sum / values.length;
}

export function getQuestionMinValue(q: Question): number {
  return Math.min(q.rightValue, q.leftValue);
}

export function getQuestionMaxValue(q: Question): number {
  return Math.max(q.leftValue, q.rightValue);
}

export function getMinQuestionValue(os: IOutcomeSet): number | undefined {
  return getQuestions(os).reduce<number>((prev, q: Question) => {
    const qMin = getQuestionMinValue(q);
    return prev ? Math.min(qMin, prev) : qMin;
  }, undefined);
}

export function getMaxQuestionValue(os: IOutcomeSet): number | undefined {
  return getQuestions(os).reduce<number>((prev, q: Question) => {
    const qMax = getQuestionMaxValue(q);
    return prev ? Math.max(qMax, prev) : qMax;
  }, undefined);
}

export function getMinCategoryValue(os: IOutcomeSet): number | undefined {
  return os.categories.reduce<number>((min, c) => {
    const catMin = getCategoryMinValue(os, c.id);
    if (catMin === undefined) {
      return min;
    }
    return min ? Math.min(catMin, min) : catMin;
  }, undefined);
}

export function getMaxCategoryValue(os: IOutcomeSet): number | undefined {
  return os.categories.reduce<number>((max, c) => {
    const catMax = getCategoryMaxValue(os, c.id);
    if (catMax === undefined) {
      return max;
    }
    return max ? Math.max(catMax, max) : catMax;
  }, undefined);
}

export function getCategoryMaxValue(
  os: IOutcomeSet,
  cID: string
): number | undefined {
  return aggregateAcrossCategoryQuestions(os, cID, (q: Question) =>
    Math.max(q.leftValue, q.rightValue)
  );
}

export function getCategoryMinValue(
  os: IOutcomeSet,
  cID: string
): number | undefined {
  return aggregateAcrossCategoryQuestions(os, cID, (q: Question) =>
    Math.min(q.leftValue, q.rightValue)
  );
}

function aggregateAcrossCategoryQuestions(
  os: IOutcomeSet,
  cID: string,
  questionMapper: (q: Question) => number
): number | undefined {
  const c = getCategory(os, cID);
  const catQs = getCategoryQuestions(os, cID);
  if (catQs.length === 0 || c === undefined) {
    return undefined;
  }
  const values = catQs.map(questionMapper);
  return aggregate(values, c.aggregation);
}

export function getQuestions(
  os: IOutcomeSet,
  includeArchived = false
): IQuestion[] {
  return os.questions.filter((q) => includeArchived || !q.archived);
}

function getCategoryQuestions(
  os: IOutcomeSet,
  cID: string,
  includeArchived = false
): IQuestion[] {
  return getQuestions(os, includeArchived).filter((q) => q.categoryID === cID);
}

function getCategory(os: IOutcomeSet, cID: string): ICategory | undefined {
  return os.categories.find((c) => c.id === cID);
}

export function convertCategoryValueToPercentage(
  os: IOutcomeSet,
  cID: string,
  value: number
): number | undefined {
  const min = getCategoryMinValue(os, cID);
  const max = getCategoryMaxValue(os, cID);
  if (min === undefined || max === undefined) {
    return undefined;
  }
  return (value / (max - min)) * 100;
}

export function convertQuestionValueToPercentage(
  os: IOutcomeSet,
  qID: string,
  value: number
): number | undefined {
  const q: Question = os.questions.find((q) => q.id === qID) as Question;
  if (q === undefined) {
    return undefined;
  }
  const max = Math.max(q.leftValue, q.rightValue);
  const min = Math.min(q.leftValue, q.rightValue);
  return (value / (max - min)) * 100;
}

export function getCategoryFriendlyName(
  catID: string,
  qs: IOutcomeSet
): string {
  const cat = qs.categories.find((c) => c.id === catID);
  if (cat === undefined) {
    return "Unknown Category";
  }
  return cat.name;
}

export function getQuestionFriendlyName(
  qID: string,
  qs: IOutcomeSet,
  allowShort = true
): string {
  const q = qs.questions.find((q) => q.id === qID);
  if (q === undefined) {
    return "Unknown Question";
  }
  let question = q.question;
  if (allowShort && !isNullOrUndefined(q.short) && q.short !== "") {
    question = q.short;
  }
  if (q.archived) {
    question = `${question} (archived)`;
  }
  return question;
}
