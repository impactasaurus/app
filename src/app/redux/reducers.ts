import {combineReducers, Reducer} from 'redux';
import { routerReducer } from 'react-router-redux';
import { IStore } from './IStore';

import {reducer as pref} from 'redux/modules/pref';
import {reducer as user} from 'redux/modules/user';
import {reducer as storage} from 'redux/modules/storage';

const { reducer } = require('redux-connect');

export default function getReducers(apollo): Reducer<IStore> {
  const internalReducers = {
    routing: routerReducer,
    reduxAsyncConnect: reducer,
    pref,
    user,
    storage,
  };
  return combineReducers<IStore>({
    ...internalReducers,
    apollo,
  });
}
