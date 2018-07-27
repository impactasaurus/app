import {IState as PrefState} from 'redux/modules/pref';

export const VisualisationKey = 'vis';
export enum Visualisation {
  RADAR,
  TABLE,
  GRAPH,
}
export function getVisualisation(prefState: PrefState, allowGraph: boolean): Visualisation {
  const value: string|undefined = prefState[VisualisationKey];
  if (value === undefined) {
    return Visualisation.RADAR;
  }
  const viz = Visualisation[value];
  if (viz === Visualisation.GRAPH && allowGraph === false) {
    return Visualisation.TABLE;
  }
  return viz;
}

export const AggregationKey = 'agg';
export enum Aggregation {
  QUESTION,
  CATEGORY,
}
export function getAggregation(prefState: PrefState, isCategoryAgPossible: boolean): Aggregation {
  if (!isCategoryAgPossible) {
    return Aggregation.QUESTION;
  }
  const value: string|undefined = prefState[AggregationKey];
  if (value === undefined) {
    return Aggregation.QUESTION;
  }
  return Aggregation[value];
}

export const SelectedQuestionSetIDKey = 'selectedQSID';
export function getSelectedQuestionSetID(prefState: PrefState): string|undefined {
  return prefState[SelectedQuestionSetIDKey];
}
