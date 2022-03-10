import "isomorphic-fetch";
import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { configureStore } from "./app/redux/store";
import { getToken } from "helpers/auth";
import Raven from "raven-js";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  IntrospectionFragmentMatcher,
} from "react-apollo";
import * as containers from "./app/containers";
import withTracker from "./app/containers/withTracking";
import { Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ConnectedRouter } from "connected-react-router";
import { setupBrandColors } from "theme/branding";
import { setupI18n } from "./i18n/setup";
import { Provider as ReactReduxProvider } from "react-redux";
import {
  UnsupportedBrowser,
  unsupportedBrowser,
} from "components/UnsupportedBrowser";
const appConfig = require("../config/main");
const introspectionQueryResultData = require("./app/apollo/fragmentTypes.json");

const rootElement = document.getElementById("impactasaurus");

const initApp = () => {
  if (appConfig.env === "production") {
    Raven.config(appConfig.app.errorTracking.url, {
      release: appConfig.build,
    }).install();
  }

  const networkInterface = createNetworkInterface({
    uri: appConfig.app.api + "/v1/graphql",
  });
  networkInterface.use([
    {
      applyMiddleware(req: any, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers.authorization = getToken()
          ? `Bearer ${getToken()}`
          : null;
        next();
      },
    },
  ]);
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
    window.__INITIAL_STATE__
  );

  setupI18n();
  setupBrandColors();

  ReactDOM.render(
    <ReactReduxProvider store={store}>
      <ApolloProvider client={client} store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={withTracker(containers.App)} />
        </ConnectedRouter>
      </ApolloProvider>
    </ReactReduxProvider>,
    rootElement
  );
};

if (unsupportedBrowser()) {
  ReactDOM.render(<UnsupportedBrowser />, rootElement);
} else {
  initApp();
}
