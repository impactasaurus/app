import { push } from 'react-router-redux';
import { IStore } from 'redux/IStore';

export function setURL(url: string, search?: string) {
  return (dispatch, getState) => {
    const routerState = (getState() as IStore).routing.locationBeforeTransitions;
    if (routerState.pathname === url) {
      return;
    }
    dispatch(push({
      pathname: url,
      search,
    }));
  };
}

export interface IURLConnector {
    setURL?(url: string, search?: string);
}
