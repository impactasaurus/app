import { RouterState } from '@types/react-router-redux';

export interface IStore {
  routing: RouterState;
  reduxAsyncConnect: any;
  apollo: any;
};
