import {push, replace} from 'connected-react-router';
import { IStore } from 'redux/IStore';
import {Action, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

export function setURL(url: string, search?: string) {
  return (dispatch, getState): void => {
    const routerState = (getState() as IStore).router.location;
    if (routerState.pathname === url) {
      return;
    }
    dispatch(push({
      pathname: url,
      search,
    }));
  };
}

export function replaceSearchAction(search: string): Action {
  return replace({
    search,
  });
}

export interface IURLConnector {
    setURL?(url: string, search?: string);
}

export const UrlHOC = <P extends IURLConnector>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> => {
  return connect<P>(undefined, (dispatch) => ({
    setURL: bindActionCreators(setURL, dispatch),
  }))(WrappedComponent);
}
