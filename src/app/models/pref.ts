import { IState as PrefState } from "redux/modules/pref";

export const VisualisationKey = "vis";
export enum Visualisation {
  RADAR,
  TABLE,
  GRAPH,
  BAR,
  DISTRIBUTION,
}
export function getVisualisation(
  prefState: PrefState,
  allowed: Visualisation[] = [
    Visualisation.TABLE,
    Visualisation.GRAPH,
    Visualisation.RADAR,
    Visualisation.BAR,
  ]
): Visualisation {
  const fallback = allowed.length > 0 ? allowed[0] : Visualisation.TABLE;
  const value: string | undefined = prefState[VisualisationKey];
  if (value === undefined) {
    return fallback;
  }
  const viz = Visualisation[value];
  const valid = allowed.find((a) => a === viz) !== undefined;
  if (!valid) {
    return fallback;
  }
  return viz;
}

export const AggregationKey = "agg";
export enum Aggregation {
  QUESTION,
  CATEGORY,
}
export function getAggregation(
  prefState: PrefState,
  isCategoryAgPossible: boolean
): Aggregation {
  if (!isCategoryAgPossible) {
    return Aggregation.QUESTION;
  }
  const value: string | undefined = prefState[AggregationKey];
  if (value === undefined) {
    return Aggregation.QUESTION;
  }
  return Aggregation[value];
}

export const QuestionnaireKey = "questionnaire";
export function getSelectedQuestionSetID(
  prefState: PrefState
): string | undefined {
  return prefState[QuestionnaireKey];
}
