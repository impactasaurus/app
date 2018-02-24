import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { IStore } from './IStore';

import {reducer as pref} from 'redux/modules/pref';
import {reducer as user} from 'redux/modules/user';

const { reducer } = require('redux-connect');

export default function getReducers(clientReducers: Redux.ReducersMapObject): Redux.Reducer<IStore> {
  const internalReducers = {
    routing: routerReducer,
    reduxAsyncConnect: reducer,
    pref,
    user,
  };
  return combineReducers<IStore>({...internalReducers, ...clientReducers});
}
