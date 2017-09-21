import {IState as PrefState} from 'modules/pref';

export const VisualisationKey = 'vis';
export enum Visualisation {
  RADAR,
  TABLE,
}
export function getVisualisation(prefState: PrefState): Visualisation {
  const value: string|undefined = prefState[VisualisationKey];
  if (value === undefined) {
    return Visualisation.RADAR;
  }
  return Visualisation[value];
}

export const AggregationKey = 'agg';
export enum Aggregation {
  QUESTION,
  CATEGORY,
}
export function getAggregation(prefState: PrefState): Aggregation {
  const value: string|undefined = prefState[AggregationKey];
  if (value === undefined) {
    return Aggregation.QUESTION;
  }
  return Aggregation[value];
}
