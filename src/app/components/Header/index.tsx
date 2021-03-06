import * as React from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { IStore } from 'redux/IStore';
import {isUserLoggedIn, isBeneficiaryUser, RequestLogoutFunc, requestLogOut} from 'redux/modules/user';
import './style.less';
import Logo from '../Logo';
import {Link} from 'react-router-dom';
import {getUserName} from 'helpers/auth';
import { withTranslation, WithTranslation } from 'react-i18next';
const { connect } = require('react-redux');

interface IProps extends WithTranslation {
  currentURL?: string;
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
  logout?: RequestLogoutFunc;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isBeneficiaryUser(state.user),
  currentURL: state.router.location.pathname,
}), (dispatch) => ({
  logout: bindActionCreators(requestLogOut, dispatch),
}))
class HeaderInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.isActive = this.isActive.bind(this);
  }

  private isActive(url: string, exact = false): boolean {
    if (exact) {
      return this.props.currentURL === url;
    }
    return this.props.currentURL !== undefined && this.props.currentURL.startsWith(url);
  }

  private logOut() {
    return () => {
      this.props.logout('/login');
    };
  }

  public render() {
    const {t, isLoggedIn, isBeneficiary} = this.props;
    if(isLoggedIn && isBeneficiary !== true) {
      return(
        <Menu size="massive">
          <Menu.Item as={Link} to="/" active={this.isActive('/', true)} id="home-link" className="icon-menu-item">
            <Logo />
          </Menu.Item>
          <Menu.Item as={Link} to="/beneficiary" active={this.isActive('/beneficiary')}>
            <Icon name="user" className="replacement" />
            <span className="title">{t('Beneficiary')}</span>
          </Menu.Item>
          <Menu.Item as={Link} to="/report" active={this.isActive('/report')}>
            <Icon name="line graph" className="replacement" />
            <span className="title">{t('Report')}</span>
          </Menu.Item>
          <Menu.Item as={Link} to="/questions" active={this.isActive('/catalogue') || this.isActive('/questions')}>
            <Icon name="question" className="replacement" />
            <span className="title">{t('Questionnaires')}</span>
          </Menu.Item>
          <Menu.Item as={Link} to="/record" active={this.isActive('/record') || this.isActive('/meeting') || this.isActive('/dataentry')} id="add-menu-link">
            <Icon name="plus" className="required" />
          </Menu.Item>

          <Menu.Menu className="right" position="right">
            <Menu.Item as={Link} to="/settings" active={this.isActive('/settings')}>
              <Icon name="cog" className="replacement" />
              <span className="title">{t('Settings')}</span>
            </Menu.Item>
            <Dropdown item trigger={`${getUserName()}`}id="user-menu">
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile" ><Icon name="user circle" className="required"/> {t('Profile')}</Dropdown.Item>
                <Dropdown.Item onClick={this.logOut()}><Icon name="log out" className="required"/> {t('Log Out')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      );
    } else if (this.props.isLoggedIn && this.props.isBeneficiary) {
      return(
        <Menu size="massive">
          <Menu.Item id="home-link">
            <Logo />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name="log out" onClick={this.logOut()} />
          </Menu.Menu>
        </Menu>
      );
    } else {
      return(
        <Menu size="massive">
          <Menu.Item as={Link} to="/" active={this.isActive('/', true)} id="home-link" className="icon-menu-item">
            <Logo />
          </Menu.Item>
        </Menu>
      );
    }
  }
}

const Header = withTranslation()(HeaderInner);
export {Header};
