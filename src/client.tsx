import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';
import { getToken } from 'helpers/auth';
import 'isomorphic-fetch';
import routes from './app/routes';

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: 'https://impact-server.herokuapp.com/v1/graphql',
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
    >
      {routes}
    </Router>
  </ApolloProvider>,
  document.getElementById('app'),
);
