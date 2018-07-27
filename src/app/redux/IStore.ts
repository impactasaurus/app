import { RouterState } from 'connected-react-router';
import {IState as PrefState} from 'redux/modules/pref';
import {IState as UserState} from 'redux/modules/user';
import {IState as StorageState} from 'redux/modules/storage';

export interface IStore {
  router: RouterState;
  apollo: any;
  pref: PrefState;
  user: UserState;
  storage: StorageState;
}
