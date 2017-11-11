import * as React from 'react';
import { getToken, getExpiryDate, getUserID, saveAuth, isBeneficiaryUser } from 'helpers/auth';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { RouterState } from '@types/react-router-redux';
import {IURLConnector} from 'redux/modules/url';
import { IStore } from 'redux/IStore';
const { connect } = require('react-redux');
const config = require('../../../../config/main').app.auth;
const ReactGA = require('react-ga');
import {setUserDetails, setLoggedInStatus, SetUserDetailsFunc, SetLoggedInStatusFunc, getUserID as getUserIDFromStore, isUserLoggedIn} from 'modules/user';

interface IProps extends IURLConnector {
  routeState?: RouterState;
  setUserDetails?: SetUserDetailsFunc;
  setLoggedInStatus?: SetLoggedInStatusFunc;
  lastUserID?: string;
  isLoggedIn?: boolean;
}

interface IState {
  listening?: boolean;
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
      listening: false,
    };
    this.setup = this.setup.bind(this);
    this.sendToLogin = this.sendToLogin.bind(this);
    this.isStoredJWTValid = this.isStoredJWTValid.bind(this);
    this.setupRefreshTrigger = this.setupRefreshTrigger.bind(this);
    this.trackUser = this.trackUser.bind(this);
    this.listenForRefresh = this.listenForRefresh.bind(this);
    this.isPublicPage = this.isPublicPage.bind(this);
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

  private refreshToken() {
    const iframe = document.getElementById('refresh-iframe') as HTMLIFrameElement;
    iframe.contentWindow.postMessage({
      type: 'refresh_token',
      payload: {
        url: `https://${config.domain}/authorize?client_id=${config.clientID}&response_type=token&connection=${config.connection}&sso=true&scope=${config.scope}&redirect_uri={REDIRECT}`,
        replaceToken: '{REDIRECT}',
      },
    }, window.location.origin);
  }

  private listenForRefresh() {
    if (this.state.listening) {
      return;
    }
    const refreshMessageReceiver = (e) => {
      if (e.origin === parent.location.origin && e.data.type === 'token_refreshed') {
        saveAuth(e.data.payload.token);
        this.setup();
      }
    };
    window.addEventListener('message', refreshMessageReceiver, false);
    this.setState({
      listening: true,
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
    this.listenForRefresh();
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
