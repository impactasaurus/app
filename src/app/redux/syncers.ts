import {Store} from 'redux';
import {IStore} from './IStore';
import {ReduxQuerySync} from './querySync';
import {sync as VizControlPanelSync} from 'components/VizControlPanel/urlParamSync';

export const ConfigureQuerySyncers = (store: Store<IStore>) => {
  ReduxQuerySync(store, {...VizControlPanelSync});
};
