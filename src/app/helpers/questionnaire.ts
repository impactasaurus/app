import {IOutcomeSet} from '../models/outcomeSet';
import {IQuestion, Question} from 'models/question';

function aggregate(values: number[], aggregation: string): number {
  if (values.length === 0) {
    return 0;
  }
  const sum = values.reduce((s, v) => s+v, 0);
  if (aggregation === 'sum') {
    return sum;
  }
  return sum / values.length;
}

export function getMinQuestionValue(os: IOutcomeSet): number|undefined {
  return getQuestions(os).reduce<number>((prev, q: Question) => {
    return prev ? Math.min(q.minValue, q.maxValue, prev) : Math.min(q.minValue, q.maxValue);
  }, undefined);
}

export function getMaxQuestionValue(os: IOutcomeSet): number|undefined {
  return getQuestions(os).reduce<number>((prev, q: Question) => {
    return prev ? Math.max(q.minValue, q.maxValue, prev) : Math.max(q.minValue, q.maxValue);
  }, undefined);
}

export function getMinCategoryValue(os: IOutcomeSet): number|undefined {
  return os.categories.reduce<number>((min, c) => {
    const catQs = getCategoryQuestions(os, c.id);
    if (catQs.length === 0) {
      return min;
    }
    const minValues = catQs.map((q: Question) => Math.min(q.minValue, q.maxValue));
    const catMin = aggregate(minValues, c.aggregation);
    return min ? Math.min(catMin, min) : catMin;
  }, undefined);
}

export function getMaxCategoryValue(os: IOutcomeSet): number|undefined {
  return os.categories.reduce<number>((max, c) => {
    const catQs = getCategoryQuestions(os, c.id);
    if (catQs.length === 0) {
      return max;
    }
    const maxValues = catQs.map((q: Question) => Math.max(q.minValue, q.maxValue));
    const catMax = aggregate(maxValues, c.aggregation);
    return max ? Math.max(catMax, max) : catMax;
  }, undefined);
}

function getQuestions(os: IOutcomeSet, includeArchived = false): IQuestion[] {
  return os.questions.filter((q) => includeArchived || !q.archived);
}

function getCategoryQuestions(os: IOutcomeSet, cID: string, includeArchived = false): IQuestion[] {
  return getQuestions(os, includeArchived).filter((q) => q.categoryID === cID);
}
