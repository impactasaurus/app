import 'isomorphic-fetch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configureStore } from './app/redux/store';
import { getToken } from 'helpers/auth';
import Raven from 'raven-js';
import { ApolloClient, ApolloProvider, createNetworkInterface, IntrospectionFragmentMatcher } from 'react-apollo';
import * as containers from './app/containers';
import withTracker from './app/containers/withTracking';
import {Route} from 'react-router-dom';

import { createBrowserHistory } from 'history';
import {ConnectedRouter} from 'connected-react-router';
import { setupBrandColors } from 'theme/branding';

const appConfig = require('../config/main');
const introspectionQueryResultData = require('./app/apollo/fragmentTypes.json');

if (appConfig.env === 'production') {
  Raven.config(appConfig.app.errorTracking.url, {
    release: appConfig.build,
  }).install();
}

const networkInterface = createNetworkInterface({
  uri: appConfig.app.api + '/v1/graphql',
});
networkInterface.use([{
  applyMiddleware(req: any, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers.authorization = getToken() ? `Bearer ${getToken()}` : null;
    next();
  },
}]);
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
const client = new ApolloClient({
  networkInterface,
  fragmentMatcher,
});

const history = createBrowserHistory();
const store = configureStore(
  history,
  client.reducer(),
  [client.middleware()],
  window.__INITIAL_STATE__,
);

setupBrandColors();

ReactDOM.render(
  <ApolloProvider client={client} store={store}>
    <ConnectedRouter
      history={history}
    >
      <Route path="/" component={
        withTracker(containers.App)
      } />
    </ConnectedRouter>
  </ApolloProvider>,
  document.getElementById('impactasaurus'),
);
