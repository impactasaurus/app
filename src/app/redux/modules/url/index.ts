import {push, replace} from 'connected-react-router';
import { IStore } from 'redux/IStore';

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

export function replaceSearchAction(search: string) {
  return replace({
    search,
  });
}

export interface IURLConnector {
    setURL?(url: string, search?: string);
}
