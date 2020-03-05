import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import { Route, Switch } from 'react-router-dom';
import * as containers from 'containers';
import {SecondaryMenu} from 'components/SecondaryMenu';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  currentURL?: string;
  match?: {
    url: string,
  };
}

@connect((state: IStore): IProps => {
  return {
    currentURL: state.router.location.pathname,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Settings extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.isSelected = this.isSelected.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  private isSelected(url: string): boolean {
    return this.props.currentURL !== undefined && this.props.currentURL.includes(url);
  }

  private isExact(url: string): boolean {
    return this.props.currentURL !== undefined && this.props.currentURL === url;
  }

  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
    };
  }

  public render() {
    const match = this.props.match.url;
    return (
      <div id="settings">
        <Helmet>
          <title>Settings</title>
        </Helmet>
        <SecondaryMenu>
          <Menu.Item name="Account" active={this.isSelected('/settings/account') || this.isExact(`${match}/`) || this.isExact(`${match}`)} onClick={this.handleClick('/settings/account')} />
          <Menu.Item name="Data" active={this.isSelected('/settings/data')} onClick={this.handleClick('/settings/data')} />
          <Menu.Item name="Organisation" active={this.isSelected('/settings/organisation')} onClick={this.handleClick('/settings/organisation')} />
          <Menu.Item name="Users" active={this.isSelected('/settings/users')} onClick={this.handleClick('/settings/users')} />
        </SecondaryMenu>

        <Switch>
          <Route exact={true} path={`${match}/`} component={containers.Account} />
          <Route path={`${match}/account`} component={containers.Account} />
          <Route path={`${match}/data/questionnaire/export/:id`} component={containers.ExportQuestionnaire} />
          <Route path={`${match}/data`} component={containers.Data} />
          <Route path={`${match}/organisation`}  component={containers.Organisation} />
          <Route path={`${match}/users`}  component={containers.Users} />
        </Switch>
      </div>
    );
  }
}

export { Settings };
