import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { IStore } from './IStore';

const { reducer } = require('redux-connect');

export default function getReducers(clientReducers: Redux.ReducersMapObject): Redux.Reducer<IStore> {
  const internalReducers = {
    routing: routerReducer,
    reduxAsyncConnect: reducer,
  };
  return combineReducers<IStore>({...internalReducers, ...clientReducers});
}
