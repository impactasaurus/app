import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import { IStore } from 'redux/IStore';
import { clearAuth } from 'helpers/auth';
import {isUserLoggedIn, isBeneficiaryUser} from 'redux/modules/user';
import './style.less';
const { connect } = require('react-redux');
const TwitterIcon = require('./twitter.inline.svg');
const Logo = require('./logo.inline.svg');

interface IProps extends IURLConnector  {
  currentURL?: string;
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isBeneficiaryUser(state.user),
  currentURL: state.routing.locationBeforeTransitions.pathname,
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Header extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.isActive = this.isActive.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  private isActive(url: string, exact: boolean = false): boolean {
    if (exact) {
      return this.props.currentURL === url;
    }
    return this.props.currentURL !== undefined && this.props.currentURL.startsWith(url);
  }

  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
    };
  }

  private logOut() {
    return () => {
      clearAuth();
      this.props.setURL('/login');
    };
  }

  public render() {
    if(this.props.isLoggedIn && this.props.isBeneficiary !== true) {
      return(
        <Menu size="massive">
          <Menu.Item active={this.isActive('/', true)} onClick={this.handleClick('/')} className="icon-menu-item">
            <Logo />
          </Menu.Item>
          <Menu.Item name="record" active={this.isActive('/record') || this.isActive('/meeting') || this.isActive('/dataentry')} onClick={this.handleClick('/record')} />
          <Menu.Item name="beneficiary" active={this.isActive('/beneficiary')} onClick={this.handleClick('/beneficiary')} />
          <Menu.Item name="report" active={this.isActive('/report')} onClick={this.handleClick('/report')} />

          <Menu.Menu position="right">
            <Menu.Item href="https://twitter.com/impactasaurus" target="blank" className="icon-menu-item">
              <TwitterIcon />
            </Menu.Item>
            <Menu.Item name="settings" active={this.isActive('/settings')} onClick={this.handleClick('/settings')} />
            <Menu.Item name="log out" onClick={this.logOut()} />
          </Menu.Menu>
        </Menu>
      );
    } else if (this.props.isLoggedIn && this.props.isBeneficiary) {
      return(
        <Menu size="massive">
          <Menu.Menu position="right">
            <Menu.Item name="log out" onClick={this.logOut()} />
          </Menu.Menu>
        </Menu>
      );
    } else {
      return(
        <Menu size="massive">
          <Menu.Item name="Impactasaurus" active={this.isActive('/', true)} onClick={this.handleClick('/')} />
        </Menu>
      );
    }
  }
}

export {Header};
