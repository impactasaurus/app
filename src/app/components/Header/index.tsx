import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
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
  currentURL: state.router.location.pathname,
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
          <Menu.Item id="home-link" active={this.isActive('/', true)} onClick={this.handleClick('/')} className="icon-menu-item">
            <Logo />
          </Menu.Item>
          <Menu.Item id="add-menu-link" active={this.isActive('/record') || this.isActive('/meeting') || this.isActive('/dataentry')} onClick={this.handleClick('/record')}>
            <Icon name="plus"/>
            <span>Record</span>
          </Menu.Item>
          <Menu.Item active={this.isActive('/beneficiary')} onClick={this.handleClick('/beneficiary')}>
            <Icon name="user"/>
            <span>Beneficiary</span>
          </Menu.Item>
          <Menu.Item active={this.isActive('/report')} onClick={this.handleClick('/report')}>
            <Icon name="line graph"/>
            <span>Report</span>
          </Menu.Item>
          <Menu.Item active={this.isActive('/catalogue') || this.isActive('/questions')} onClick={this.handleClick('/questions')}>
            <Icon name="question"/>
            <span>Questionnaires</span>
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item id="twitter-menu-link" href="https://twitter.com/impactasaurus" target="blank" className="icon-menu-item">
              <TwitterIcon/>
            </Menu.Item>
            <Menu.Item active={this.isActive('/settings')} onClick={this.handleClick('/settings')}>
              <Icon name="cog"/>
              <span>Settings</span>
            </Menu.Item>
            <Menu.Item onClick={this.logOut()}>
              <Icon name="log out"/>
              <span>Log Out</span>
            </Menu.Item>
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
