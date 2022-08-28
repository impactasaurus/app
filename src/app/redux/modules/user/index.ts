import { Action } from "redux";
import { useSelector } from "react-redux";
import { IStore } from "redux/IStore";
import { useDispatch, shallowEqual } from "react-redux";
import { getDecodedToken } from "helpers/auth";
import { useLocation } from "react-router-dom";

export const SET_JWT = "SET_JWT";
export const REQUEST_LOGOUT = "REQUEST_LOGOUT";
export const HYDRATE_JWT = "HYDRATE_JWT";

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
  beneficiarySequence: string[] | null;
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
    beneficiarySequence: null,
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

const getOrg = (token: any): string | null => {
  const o = getKey<string | null>(
    token,
    "https://app.impactasaurus.org/organisation",
    null
  );
  return o === "" ? null : o;
};

const getSeq = (token: any): string[] | null => {
  const seq = getKey<string[]>(
    token,
    "https://app.impactasaurus.org/sequence",
    null
  );
  const scopes = getKey<string[]>(
    token,
    "https://app.impactasaurus.org/scopes",
    null
  );
  const scope = getKey<string>(
    token,
    "https://app.impactasaurus.org/scope",
    null
  );
  return seq || scopes || (scope ? [scope] : null);
};

const hydrateUser = (token: any): IUser => {
  const expiry = getExpiryDate(token);
  return {
    userID: getStringOrNull(token, "sub"),
    email: getStringOrNull(token, "https://app.impactasaurus.org/email"),
    name: getStringOrNull(token, "https://app.impactasaurus.org/name"),
    beneficiaryUser: getKey<boolean>(
      token,
      "https://app.impactasaurus.org/beneficiary",
      false
    ),
    beneficiarySequence: getSeq(token),
    loggedIn: expiry === null ? false : expiry.getTime() - Date.now() > 0,
    org: getOrg(token),
    created: getStringOrNull(token, "https://app.impactasaurus.org/created_at"),
  };
};

const hydrateJWT = (jwt: string, state: IState): IState => {
  const decoded = getDecodedToken(jwt);
  return {
    session: {
      expiry: getExpiryDate(decoded),
      JWT: jwt,
      logOutRequest: state.session.logOutRequest,
    },
    hydrated: hydrateUser(decoded),
  };
};

export function reducer(state: IState = initialState, action: IAction): IState {
  switch (action.type) {
    case SET_JWT: {
      if (action.payload.jwt === null) {
        const c: IState = {
          hydrated: { ...state.hydrated },
          session: { ...state.session },
        };
        delete c.session.JWT;
        return c;
      }
      return hydrateJWT(action.payload.jwt, state);
    }

    case HYDRATE_JWT: {
      if (!state.session?.JWT) {
        return state;
      }
      return hydrateJWT(state.session.JWT, state);
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

export const useLogout = (): ((redirect?: string) => void) => {
  const dispatch = useDispatch();
  const { pathname: currentURL } = useLocation();
  const logout = (redirect?: string): void => {
    dispatch(requestLogOut(redirect ?? currentURL));
  };
  return logout;
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

export const useHydrateJWT = (): (() => void) => {
  const dispatch = useDispatch();
  const hydrateJWT = (): void => {
    dispatch({
      type: HYDRATE_JWT,
    });
  };
  return hydrateJWT;
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
