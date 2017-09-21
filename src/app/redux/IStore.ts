import { RouterState } from '@types/react-router-redux';
import {IState as PrefState} from 'redux/modules/pref';

export interface IStore {
  routing: RouterState;
  reduxAsyncConnect: any;
  apollo: any;
  pref: PrefState;
};
