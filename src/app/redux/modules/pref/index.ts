import { Action } from "redux";
import { IStore } from "redux/IStore";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

export const SET_PREF = "SET_PREF";

export interface IAction extends Action {
  type: string;
  payload: {
    key: string;
    value: string;
  };
}

export interface IState {
  [index: string]: string;
}

const initialState = {};

export function reducer(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case SET_PREF:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    default:
      return state;
  }
}

export function setPref(key: string, value: string) {
  return {
    type: SET_PREF,
    payload: {
      key,
      value,
    },
  };
}

export type SetPrefFunc = (key: string, value: string) => void;

export const usePreference = (key: string): string => {
  return useSelector((store: IStore) => store.pref[key], shallowEqual);
};

export const useSetPreference = (): ((k: string, v: string) => void) => {
  const dispatch = useDispatch();
  const sp = (k: string, v: string): void => {
    dispatch(setPref(k, v));
  };
  return sp;
};
