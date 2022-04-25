import { Action } from "redux";
import { useSelector } from "react-redux";
import { IStore } from "redux/IStore";
import { useDispatch, shallowEqual } from "react-redux";
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

export interface IUser {
  userID: string | null;
  email: string | null;
  name: string | null;
  loggedIn: boolean;
  beneficiaryUser: boolean;
  beneficiaryScope: string | null;
  org: string | null;
  created: string | null;
}

export interface ISession {
  JWT?: string;
  logOutRequest?: string;
  expiry: Date | null;
}

export interface IState {
  hydrated: IUser;
  session: ISession;
}

const initialState: IState = {
  hydrated: {
    userID: null,
    email: null,
    name: null,
    loggedIn: false,
    beneficiaryUser: false,
    beneficiaryScope: null,
    org: null,
    created: null,
  },
  session: {
    expiry: null,
  },
};

const getKey = <T>(token: any, key: string, def: T): T => {
  if (!token || !token[key]) {
    return def;
  }
  return token[key];
};

const getStringOrNull = (token: any, key: string): string | null =>
  getKey<string | null>(token, key, null);

const getExpiryDate = (token: any): Date | null => {
  const exp = getKey<number | null>(token, "exp", null);
  if (exp === null) {
    return null;
  }
  return new Date(exp * 1000);
};

const hydrateUser = (token: any): IUser => {
  const expiry = getExpiryDate(token);
  return {
    userID: getStringOrNull(token, "sub"),
    email: getStringOrNull(token, "email"),
    name: getStringOrNull(token, "name"),
    beneficiaryUser: getKey<boolean>(
      token,
      "https://app.impactasaurus.org/beneficiary",
      false
    ),
    beneficiaryScope: getKey(
      token,
      "https://app.impactasaurus.org/scope",
      null
    ),
    loggedIn: expiry === null ? false : expiry.getTime() - Date.now() > 0,
    org: getKey<string | null>(
      token,
      "https://app.impactasaurus.org/organisation",
      null
    ),
    created: getStringOrNull(token, "https://app.impactasaurus.org/created_at"),
  };
};

export function reducer(state: IState = initialState, action: IAction): IState {
  switch (action.type) {
    case SET_JWT: {
      if (action.payload.jwt === null) {
        const c = { ...state };
        delete c.session.JWT;
        return c;
      }
      const decoded = getDecodedToken(action.payload.jwt);
      return {
        session: {
          expiry: getExpiryDate(decoded),
          JWT: action.payload.jwt,
          logOutRequest: state.session.logOutRequest,
        },
        hydrated: hydrateUser(decoded),
      };
    }

    case REQUEST_LOGOUT:
      return {
        hydrated: { ...state.hydrated },
        session: {
          ...state.session,
          logOutRequest: action.payload.redirect,
        },
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

export const isBeneficiaryUser = (state: IState): boolean | undefined => {
  return state.hydrated.beneficiaryUser;
};

export const useUser = (): IUser => {
  return useSelector((store: IStore) => store.user.hydrated, shallowEqual);
};

export const useJWT = (): string | undefined => {
  return useSelector((store: IStore) => store.user.session.JWT);
};

export const useSession = (): ISession => {
  return useSelector((store: IStore) => store.user.session, shallowEqual);
};
