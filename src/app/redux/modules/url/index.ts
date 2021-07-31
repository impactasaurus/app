import { push, replace } from "connected-react-router";
import { IStore } from "redux/IStore";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

export function setURL(url: string, search?: string | URLSearchParams) {
  return (dispatch: Dispatch, getState: () => IStore): void => {
    const routerState = getState().router.location;
    if (routerState.pathname === url) {
      return;
    }
    dispatch(
      push({
        pathname: url,
        search: typeof search === "object" ? `?${search.toString()}` : search,
      })
    );
  };
}

export function replaceSearchAction(search: string): Action {
  return replace({
    search,
  });
}

export interface IURLConnector {
  setURL?(url: string, search?: string | URLSearchParams): void;
}

export const UrlConnector = (dispatch: Dispatch): IURLConnector => ({
  setURL: bindActionCreators(setURL, dispatch),
});

export const UrlHOC = <P extends IURLConnector>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  return connect<P>(undefined, UrlConnector)(WrappedComponent);
};
