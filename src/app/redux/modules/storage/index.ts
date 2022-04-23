export const LOADED = "IMPACTASAURUS-LOADED";

export interface IState {
  loaded: boolean;
}

const initialState: IState = {
  loaded: false,
};

export function reducer(state: IState = initialState, action) {
  switch (action.type) {
    case LOADED:
      return { ...state, loaded: true };

    default:
      return state;
  }
}
