import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
const { connect } = require('react-redux');

interface IState {
  active: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Header extends React.Component<IURLConnector, IState> {

  constructor(props) {
    super(props);
    this.state = {
      active: 'home',
    };
  }

  private handleClick(url: string) {
    return (_, { name }) => {
      this.setState({
        active: name,
      });
      this.props.setURL(url);
    };
  }

  public render() {
    const activeItem = this.state.active;
    return (
      <Menu size="massive">
        <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleClick('/')} />
        <Menu.Item name="conduct" active={activeItem === 'conduct'} onClick={this.handleClick('/conduct')} />
        <Menu.Item name="review" active={activeItem === 'review'} onClick={this.handleClick('/review')} />

        <Menu.Menu position="right">
          <Menu.Item name="settings" active={activeItem === 'settings'} onClick={this.handleClick('/settings')} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export {Header};
