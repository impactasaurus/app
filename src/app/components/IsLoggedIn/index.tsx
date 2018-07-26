import * as React from 'react';
import { getToken, getExpiryDate, getUserID, saveAuth, isBeneficiaryUser } from 'helpers/auth';
import {setURL, IURLConnector} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import { RouterState } from 'react-router-redux';
import { IStore } from 'redux/IStore';
import {setUserDetails, setLoggedInStatus, SetUserDetailsFunc, SetLoggedInStatusFunc, getUserID as getUserIDFromStore, isUserLoggedIn} from 'redux/modules/user';
import {getWebAuth} from '../../helpers/auth';
import {WebAuth} from 'auth0-js';

const { connect } = require('react-redux');
const config = require('../../../../config/main').app.auth;
const ReactGA = require('react-ga');

interface IProps extends IURLConnector {
  routeState?: RouterState;
  setUserDetails?: SetUserDetailsFunc;
  setLoggedInStatus?: SetLoggedInStatusFunc;
  lastUserID?: string;
  isLoggedIn?: boolean;
}

interface IState {
  webAuth: WebAuth;
}

@connect((state: IStore) => ({
  routeState: state.routing,
  lastUserID: getUserIDFromStore(state.user),
  isLoggedIn: isUserLoggedIn(state.user),
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
  setUserDetails: bindActionCreators(setUserDetails, dispatch),
  setLoggedInStatus: bindActionCreators(setLoggedInStatus, dispatch),
}))
export class IsLoggedIn extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      webAuth: getWebAuth(),
    };
    this.setup = this.setup.bind(this);
    this.sendToLogin = this.sendToLogin.bind(this);
    this.isStoredJWTValid = this.isStoredJWTValid.bind(this);
    this.setupRefreshTrigger = this.setupRefreshTrigger.bind(this);
    this.trackUser = this.trackUser.bind(this);
    this.isPublicPage = this.isPublicPage.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  public componentDidMount() {
    this.setup();
  }

  public componentDidUpdate() {
    this.setup();
  }

  private isPublicPage(): boolean {
    for (const p of config.publicPages) {
      if (p.test(this.props.routeState.locationBeforeTransitions.pathname)) {
        return true;
      }
    }
    return false;
  }

  private sendToLogin() {
    const redirectURL = this.props.routeState.locationBeforeTransitions.pathname + this.props.routeState.locationBeforeTransitions.search;
    this.props.setURL('/login', '?redirect=' + encodeURIComponent(redirectURL));
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

  private refreshToken() {
    this.state.webAuth.checkSession({}, (err, authResult) => {
      if (err !== undefined && err !== null) {
        console.error(err.description);
        ReactGA.event({
          category : 'silent_auth',
          action : 'failed',
          label: err.description,
        });
        return;
      }
      ReactGA.event({
        category : 'silent_auth',
        action : 'success',
      });
      saveAuth(authResult.idToken);
      this.setup();
    });
  }

  private setupRefreshTrigger() {
    const msBefore = 240000;
    const setTimer = (timerName: string, onTrigger: () => void) => {
      if (this[timerName] !== undefined) {
        clearTimeout(this[timerName]);
      }
      const delta = this.getTimeToExpiry();
      if (delta < msBefore) {
        onTrigger();
        return;
      }
      const waitFor = delta-msBefore;
      this[timerName] = setTimeout(onTrigger, waitFor);
    };
    setTimer('refreshTimer', this.refreshToken);
  }

  private trackUser() {
    const userID = getUserID();
    if (userID !== this.props.lastUserID) {
      ReactGA.set({
        userId: userID,
      });
      this.props.setUserDetails(userID, isBeneficiaryUser());
    }
  }

  private setup() {
    this.trackUser();
    const isLoggedIn = this.isStoredJWTValid();
    if (this.props.isLoggedIn !== isLoggedIn) {
      this.props.setLoggedInStatus(isLoggedIn);
    }
    if (isLoggedIn === false) {
      if (this.isPublicPage() === false) {
        this.sendToLogin();
      }
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
