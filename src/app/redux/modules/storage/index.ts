import { LOAD } from "redux-storage";

export interface IState {
  loaded: boolean;
}

const initialState: IState = {
  loaded: false,
};

export function reducer(state: IState = initialState, action) {
  switch (action.type) {
    case LOAD:
      return { ...state, loaded: true };

    default:
      return state;
  }
}
