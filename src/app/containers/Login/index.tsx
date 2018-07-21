import * as React from 'react';
import { Helmet } from 'react-helmet';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {Auth0Lock} from 'components/Auth0Lock';
import {isNullOrUndefined} from 'util';
const { connect } = require('react-redux');

interface IProps {
  setURL: Redux.ActionCreator<any>;
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
class Login extends React.Component<IProps, {}> {

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
      this.props.setURL(decodeURIComponent(returnURL));
    }
  }

  public render() {
    return (
      <div>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Auth0Lock onAuthenticated={this.loggedIn} />
      </div>
    );
  }
}

export { Login }
