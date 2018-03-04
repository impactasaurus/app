import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';
import { Provider } from 'react-redux';
import { getToken } from 'helpers/auth';
import 'isomorphic-fetch';
import routes from './app/routes';
import Raven = require('raven-js');

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

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

const httpLink = createHttpLink({ uri: appConfig.app.api });
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: getToken() ? `Bearer ${getToken()}` : null,
    },
  });
  return forward(operation);
});

const link = middlewareLink.concat(httpLink);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const store = configureStore(
  browserHistory,
  {},
  [],
  window.__INITIAL_STATE__,
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router
        history={history}
        render={connectedCmp}
        onUpdate={logPageView}
      >
        {routes}
      </Router>
    </ApolloProvider>
  </Provider>,
  document.getElementById('app'),
);
