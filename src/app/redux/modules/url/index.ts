import {push, replace} from 'connected-react-router';
import { IStore } from 'redux/IStore';
import {Action} from 'redux';

export function setURL(url: string, search?: string) {
  return (dispatch, getState) => {
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
