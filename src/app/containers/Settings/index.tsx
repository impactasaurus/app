import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import './style.less';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  currentURL?: string;
}

@connect((state: IStore): IProps => {
  return {
    currentURL: state.routing.locationBeforeTransitions.pathname,
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

  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
    };
  }

  public render() {
    return (
      <div id="settings">
        <Menu pointing secondary>
          <Menu.Item name="Question Sets" active={this.isSelected('/settings/questions')} onClick={this.handleClick('/settings/questions')} />
          <Menu.Item name="Organisation" active={this.isSelected('/settings/organisation')} onClick={this.handleClick('/settings/organisation')} />
        </Menu>

        {this.props.children}
      </div>
    );
  }
}

export { Settings }
