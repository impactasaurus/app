import * as React from 'react';
import { getToken, getExpiryDate, getUserID } from 'helpers/auth';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { RouterState } from '@types/react-router-redux';
import {IURLConnector} from 'redux/modules/url';
import { IStore } from 'redux/IStore';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  routeState?: RouterState;
}

interface IState {
  lastUserID: string|null;
}

@connect((state: IStore) => ({
  routeState: state.routing,
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
export class IsLoggedIn extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      lastUserID: null,
    };
    this.checkAuth = this.checkAuth.bind(this);
    this.sendToLogin = this.sendToLogin.bind(this);
    this.isStoredJWTValid = this.isStoredJWTValid.bind(this);
    this.setupRefreshTrigger = this.setupRefreshTrigger.bind(this);
    this.trackUser = this.trackUser.bind(this);
  }

  public componentDidMount() {
    this.checkAuth();
  }

  public componentDidUpdate() {
    this.checkAuth();
  }

  private sendToLogin() {
    this.props.setURL('/login');
  }

  private getTimeToExpiry(): number {
    const expiry = getExpiryDate();
    if (expiry === null) {
      return -1;
    }
    return expiry.getTime() - Date.now();
  }

  private isStoredJWTValid() {
    const token = getToken();
    if (token === null || token === undefined) {
      return false;
    }
    if (this.getTimeToExpiry() < 0) {
      return false;
    }
    return true;
  }

  private setupRefreshTrigger() {
    const setTimer = (timerName: string, onTrigger: () => void) => {
      if (this[timerName] !== undefined) {
        clearTimeout(this[timerName]);
      }
      const delta = this.getTimeToExpiry();
      this[timerName] = setTimeout(onTrigger, delta-5000);
      return delta;
    };
    setTimer('loginTimer', this.sendToLogin);
  }

  private trackUser() {
    const userID = getUserID();
    if (userID !== this.state.lastUserID) {
      const ReactGA = require('react-ga');
      ReactGA.set({
        userId: userID,
      });
      this.setState({
        lastUserID: userID,
      });
    }
  }

  private checkAuth() {
    this.trackUser();
    if (this.isStoredJWTValid() === false) {
        this.sendToLogin();
        return;
    }
    this.setupRefreshTrigger();
  }

  public render() {
    return (
      <div />
    );
  }
}
