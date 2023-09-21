import "isomorphic-fetch";
import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { configureStore } from "./app/redux/store";
import Raven from "raven-js";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  IntrospectionFragmentMatcher,
} from "react-apollo";
import * as containers from "./app/containers";
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
import ReactGA from "react-ga4";
import { defaultDataIdFromObject } from "helpers/apollo";
const appConfig = require("../config/main");
const introspectionQueryResultData = require("./app/apollo/fragmentTypes.json");

const rootElement = document.getElementById("impactasaurus");
rootElement.classList.add(window.self == window.top ? "top" : "framed");

const initApp = () => {
  ReactGA.initialize(appConfig.app.analytics.trackingID, {
    testMode: appConfig.app.analytics.debug,
  });

  if (appConfig.env === "production") {
    Raven.config(appConfig.app.errorTracking.url, {
      release: appConfig.build,
    }).install();
  }

  const networkInterface = createNetworkInterface({
    uri: appConfig.app.api + "/v1/graphql",
  });
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });
  const client = new ApolloClient({
    networkInterface,
    fragmentMatcher,
    dataIdFromObject: (
      obj: Record<string, unknown>
    ): string | null | undefined => {
      switch (obj.__typename) {
        case "AnswerSummary":
          return undefined; // doesn't cache this properly, should be cached with the beneficiary above
        default:
          return defaultDataIdFromObject(obj); // default handling
      }
    },
  });

  const history = createBrowserHistory();
  const store = configureStore(
    history,
    client.reducer(),
    [client.middleware()],
    window.__INITIAL_STATE__
  );

  networkInterface.use([
    {
      applyMiddleware(req: any, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        const token = store.getState()?.user?.session?.JWT;
        req.options.headers.authorization = token
          ? `Bearer ${token}`
          : undefined;
        next();
      },
    },
  ]);

  setupI18n();
  setupBrandColors();

  ReactDOM.render(
    <ReactReduxProvider store={store}>
      <ApolloProvider client={client} store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={containers.App} />
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
