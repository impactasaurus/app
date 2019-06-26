import {
  Aggregation, AggregationKey, getAggregation, getVisualisation, Visualisation,
  VisualisationKey,
} from 'models/pref';
import {IParams} from 'redux/querySync';
import {IStore} from 'redux/IStore';
import {setPref} from 'redux/modules/pref';
import {pageRegex} from './index';

export const sync: IParams = {
  [VisualisationKey]: {
    selector: (store: IStore) => getVisualisation(store.pref),
    action: (value) => setPref(VisualisationKey, Visualisation[value]),
    stringToValue: (s) => Visualisation[s.toUpperCase()],
    valueToString: (v) => `${Visualisation[v]}`.toLowerCase(),
    setSearchParam: (s: IStore) => pageRegex.test(s.router.location.pathname),
  },
  [AggregationKey]: {
    selector: (store: IStore) => getAggregation(store.pref, true),
    action: (value) => setPref(AggregationKey, Aggregation[value]),
    stringToValue: (s) => Aggregation[s.toUpperCase()],
    valueToString: (v) => `${Aggregation[v]}`.toLowerCase(),
    setSearchParam: (s: IStore) => pageRegex.test(s.router.location.pathname),
  },
};
