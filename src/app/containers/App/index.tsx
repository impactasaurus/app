const appConfig = require('../../../../config/main');

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Header, IsLoggedIn } from 'components';
import './style.less';
import './../../theme/typo.less';
import 'semantic-ui-less/semantic.less';
import 'theme/form.less';

class App extends React.Component<any, any> {
  public render() {
    return (
      <section id="impactasaurus">
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <Header />
        <IsLoggedIn />
        {this.props.children}
      </section>
    );
  }
}

export { App }
