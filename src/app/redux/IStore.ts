import { ICounter } from 'models/counter';
import { IStars } from 'models/stars';
import { RouterState } from '@types/react-router-redux';

export interface IStore {
  counter: ICounter;
  stars: IStars;
  routing: RouterState;
  reduxAsyncConnect: any;
  apollo: any;
};
