export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';

export interface IAction extends Redux.Action {
  type: string;
  payload: {
    userID?: string;
    loggedIn?: boolean;
  };
}

export interface IState {
  userID?: string;
  loggedIn: boolean;
}

const initialState: IState = {
  loggedIn: false,
};

export function reducer(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case SET_USER_DETAILS:
      return Object.assign({}, state, {
        userID: action.payload.userID,
      });

    case SET_LOGIN_STATUS:
      return Object.assign({}, state, {
        loggedIn: action.payload.loggedIn,
      });

    default:
      return state;
  }
}

export type SetUserDetailsFunc = (userID: string) => void;
export function setUserDetails(userID: string): IAction {
  return {
    type: SET_USER_DETAILS,
    payload: {
      userID,
    },
  };
}

export type SetLoggedInStatusFunc = (loggedIn: boolean) => void;
export function setLoggedInStatus(loggedIn: boolean): IAction {
  return {
    type: SET_LOGIN_STATUS,
    payload: {
      loggedIn,
    },
  };
}

export function getUserID(state: IState): string|undefined {
  return state.userID;
}

export function isUserLoggedIn(state: IState): boolean {
  return state.loggedIn;
}
