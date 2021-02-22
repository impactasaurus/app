import * as React from 'react';
import {setURL} from 'redux/modules/url';
import {ActionCreator, bindActionCreators} from 'redux';
import {Auth0Lock} from 'components/Auth0Lock';
import {isNullOrUndefined} from 'util';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
const { connect } = require('react-redux');

interface IProps {
  setURL: ActionCreator<any>;
  location: {
    search: string,
  };
}

const localStorageKey = 'urlAfterLogin';

const getReturnURL = (p: IProps): string|undefined => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('redirect') === false) {
    return undefined;
  }
  return urlParams.get('redirect');
};

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class LoginInner extends React.Component<IProps, null> {

  constructor(props: IProps) {
    super(props);
    this.loggedIn = this.loggedIn.bind(this);

    const returnURL = getReturnURL(props);
    if (!isNullOrUndefined(returnURL)) {
      localStorage.setItem(localStorageKey, returnURL);
    }
  }

  private loggedIn() {
    const returnURL = localStorage.getItem(localStorageKey);
    localStorage.removeItem(localStorageKey);
    if (!isNullOrUndefined(returnURL)) {
      const components = decodeURIComponent(returnURL).split('?');
      const query: string|undefined = components.length > 1 ? '?' + components[1] : undefined;
      this.props.setURL(components[0], query);
    } else {
      this.props.setURL('/');
    }
  }

  public render() {
    return <Auth0Lock onAuthenticated={this.loggedIn} />;
  }
}
export const Login = PageWrapperHoC('Login', 'login', LoginInner);
