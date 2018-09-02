import {IStore} from './IStore';
import {Action, Store} from 'redux';
import {replaceSearchAction} from 'redux/modules/url';

export interface IParam {
  selector: (store: IStore) => any;
  action: (value: any) => Action;
  stringToValue: (s: string) => any;
  valueToString: (v: any) => string;
  defaultValue?: any;
  setSearchParam?: (store: IStore) => boolean;
}

export interface IParams {
  [param: string]: IParam;
}

export function ReduxQuerySync(store: Store<IStore>, params: IParams) {
  const { dispatch } = store;

  function getQueryValues(location) {
    const locationParams = new URLSearchParams(location.search);
    const queryValues = {};
    Object.keys(params).forEach((param) => {
      const { defaultValue = null, stringToValue = (s) => s } = params[param];
      const valueString = locationParams.get(param);
      queryValues[param] = (valueString === null)
        ? defaultValue
        : stringToValue(valueString);
    });
    return queryValues;
  }

  function loadFromURL() {
    const state = store.getState();

    const location = state.router.location;
    const queryValues = getQueryValues(location);

    const actionsToDispatch = [];
    Object.keys(queryValues).forEach((param) => {
      const value = queryValues[param];
      const { selector, action } = params[param];
      if (value !== null && selector(state) !== value) {
        actionsToDispatch.push(action(value));
      }
    });

    actionsToDispatch.forEach((action) => {
      dispatch(action);
    });
  }

  function handleStateUpdate() {
    const state = store.getState();

    const location = state.router.location;
    const locationParams = new URLSearchParams(location.search);

    Object.keys(params).forEach((param) => {
      const { selector, valueToString = (v) => `${v}`, setSearchParam = () => true } = params[param];
      if (setSearchParam(state) === false) {
        return;
      }
      const value = selector(state);
      locationParams.set(param, valueToString(value));
    });

    const newLocationSearchString = `?${locationParams}`;
    const oldLocationSearchString = location.search || '?';

    if (newLocationSearchString !== oldLocationSearchString) {
      dispatch(replaceSearchAction(newLocationSearchString));
    }
  }

  loadFromURL();

  return store.subscribe(handleStateUpdate);
}
