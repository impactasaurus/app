import { Action } from "redux";
import { useSelector } from "react-redux";
import { IStore } from "redux/IStore";
import { useDispatch } from "react-redux";
import { getDecodedToken } from "helpers/auth";

export const SET_JWT = "SET_JWT";
export const REQUEST_LOGOUT = "REQUEST_LOGOUT";

export interface IAction extends Action {
  type: string;
  payload: {
    jwt?: string;
    redirect?: string;
  };
}

export interface IState {
  JWT?: string;

  userID: string | null;
  email: string | null;
  name: string | null;
  loggedIn: boolean;
  beneficiaryUser: boolean;
  beneficiaryScope: string | null;
  org: string | null;
  created: string | null;
  expiry: Date | null;

  logOutRequest?: string;
}

const initialState: IState = {
  userID: null,
  email: null,
  name: null,
  loggedIn: false,
  beneficiaryUser: false,
  beneficiaryScope: null,
  org: null,
  created: null,
  expiry: null,
};

const getKey = <T>(token: any, key: string, def: T): T => {
  if (!token || !token[key]) {
    return def;
  }
  return token[key];
};

const getStringOrNull = (token: any, key: string): string | null =>
  getKey<string | null>(token, key, null);

export const getExpiryDate = (token: any): Date | null => {
  const exp = getKey<number | null>(token, "exp", null);
  if (exp === null) {
    return null;
  }
  return new Date(exp * 1000);
};

export function reducer(state: IState = initialState, action: IAction): IState {
  switch (action.type) {
    case SET_JWT: {
      if (!action.payload.jwt) {
        return initialState;
      }
      const decoded = getDecodedToken(action.payload.jwt);
      const expiry = getExpiryDate(decoded);
      return {
        ...state,
        JWT: action.payload.jwt,
        userID: getStringOrNull(decoded, "sub"),
        email: getStringOrNull(decoded, "email"),
        name: getStringOrNull(decoded, "name"),
        beneficiaryUser: getKey<boolean>(
          decoded,
          "https://app.impactasaurus.org/beneficiary",
          false
        ),
        beneficiaryScope: getKey(
          decoded,
          "https://app.impactasaurus.org/scope",
          null
        ),
        loggedIn: expiry === null ? false : expiry.getTime() - Date.now() > 0,
        org: getKey<string | null>(
          decoded,
          "https://app.impactasaurus.org/organisation",
          null
        ),
        created: getStringOrNull(
          decoded,
          "https://app.impactasaurus.org/created_at"
        ),
        expiry,
      };
    }

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

export function isBeneficiaryUser(state: IState): boolean | undefined {
  return state.beneficiaryUser;
}

export const useUser = (): IState => {
  return useSelector((store: IStore) => store.user);
};

export const useSetJWT = (): ((jwt: string | null) => void) => {
  const dispatch = useDispatch();
  const setJWT = (jwt: string | null): void => {
    dispatch({
      type: SET_JWT,
      payload: {
        jwt,
      },
    });
  };
  return setJWT;
};
