import { Action } from "redux";
import { useSelector } from "react-redux";
import { IStore } from "redux/IStore";
import { useDispatch } from "react-redux";

export const SET_USER_DETAILS = "SET_USER_DETAILS";
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

export const useUser = (): IState => {
  return useSelector((store: IStore) => store.user);
};

export const useSetUser = (): ((
  loggedIn: boolean,
  userID: string | null,
  beneficiaryUser: boolean
) => void) => {
  const dispatch = useDispatch();
  const setUser = (
    loggedIn: boolean,
    userID: string | null,
    beneficiaryUser: boolean
  ): void => {
    dispatch({
      type: SET_USER_DETAILS,
      payload: {
        loggedIn,
        userID,
        beneficiaryUser,
      },
    });
  };
  return setUser;
};
