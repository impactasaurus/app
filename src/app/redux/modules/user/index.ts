import { Action } from "redux";

export const SET_USER_DETAILS = "SET_USER_DETAILS";
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";
export const REQUEST_LOGOUT = "REQUEST_LOGOUT";

export interface IAction extends Action {
  type: string;
  payload: {
    userID?: string;
    beneficiaryUser?: boolean;
    loggedIn?: boolean;
    redirect?: string;
  };
}

export interface IState {
  userID?: string;
  loggedIn: boolean;
  beneficiaryUser?: boolean;
  logOutRequest?: string;
}

const initialState: IState = {
  loggedIn: false,
};

export function reducer(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userID: action.payload.userID,
        beneficiaryUser: action.payload.beneficiaryUser,
      };

    case SET_LOGIN_STATUS:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
      };

    case REQUEST_LOGOUT:
      return {
        ...state,
        logOutRequest: action.payload.redirect,
      };

    default:
      return state;
  }
}

export type SetUserDetailsFunc = (
  userID: string,
  beneficiaryUser: boolean
) => void;
export function setUserDetails(
  userID: string,
  beneficiaryUser: boolean
): IAction {
  return {
    type: SET_USER_DETAILS,
    payload: {
      userID,
      beneficiaryUser,
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

export type RequestLogoutFunc = (redirect: string) => void;
export function requestLogOut(redirect: string): IAction {
  return {
    type: REQUEST_LOGOUT,
    payload: {
      redirect,
    },
  };
}

export function getUserID(state: IState): string | undefined {
  return state.userID;
}

export function isUserLoggedIn(state: IState): boolean {
  return state.loggedIn;
}

export function isBeneficiaryUser(state: IState): boolean | undefined {
  return state.beneficiaryUser;
}

export function isLogoutRequested(state: IState): string | undefined {
  return state.logOutRequest;
}
