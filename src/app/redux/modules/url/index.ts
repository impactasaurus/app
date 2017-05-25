import { push } from 'react-router-redux';

export function setURL(url: string) {
  return (dispatch, getState) => {
    const routerState = getState().routing.locationBeforeTransitions;
    if (routerState.pathname === url) {
      return;
    }
    dispatch(push({
      pathname: url,
    }));
  };
}
