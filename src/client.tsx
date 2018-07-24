import 'isomorphic-fetch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';
import { getToken } from 'helpers/auth';
import routes from './app/routes';
import Raven = require('raven-js');

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

const appConfig = require('../config/main');

const ReactGA = require('react-ga');
ReactGA.initialize(appConfig.app.analytics.trackingID, {
  debug: appConfig.app.analytics.debug,
});
const logPageView = () => {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
};

if (appConfig.env === 'production') {
  Raven.config(appConfig.app.errorTracking.url, {
    release: appConfig.build,
  }).install();
}

const networkInterface = createNetworkInterface({
  uri: appConfig.app.api + '/v1/graphql',
});
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    req.options.headers.authorization = getToken() ? `Bearer ${getToken()}` : null;
    next();
  },
}]);
const client = new ApolloClient({networkInterface});

const store = configureStore(
  browserHistory,
  {
    apollo: client.reducer(),
  },
  [client.middleware()],
  window.__INITIAL_STATE__,
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

ReactDOM.render(
  <ApolloProvider client={client} store={store}>
    <Router
      history={history}
      render={connectedCmp}
      onUpdate={logPageView}
    >
      {routes}
    </Router>
  </ApolloProvider>,
  document.getElementById('app'),
);
