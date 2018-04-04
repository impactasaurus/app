import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Header, IsLoggedIn } from 'components';
import './style.less';
import './../../theme/typo.less';
import 'semantic-ui-less/semantic.less';
import 'theme/form.less';
import {IStore} from 'redux/IStore';
const { connect } = require('react-redux');
const appConfig = require('../../../../config/main');

interface IProps {
  storeLoaded: boolean;
}

@connect((state: IStore): IProps => {
  return {
    storeLoaded: state.storage.loaded,
  };
})
class App extends React.Component<IProps, any> {
  public render() {
    return (
      <section id="impactasaurus">
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <Header/>
        <IsLoggedIn/>
        {this.props.storeLoaded && this.props.children}
      </section>
    );
  }
}

export { App }
