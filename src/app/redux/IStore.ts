import { RouterState } from '@types/react-router-redux';
import {IState as PrefState} from 'redux/modules/pref';
import {IState as UserState} from 'redux/modules/user';

export interface IStore {
  routing: RouterState;
  reduxAsyncConnect: any;
  apollo: any;
  pref: PrefState;
  user: UserState;
};
