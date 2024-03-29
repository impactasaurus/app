import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  Store,
} from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import getReducers from "./reducers";
import { IStore } from "./IStore";
import * as storage from "redux-storage";
import createEngine from "redux-storage-engine-localstorage";
import filter from "redux-storage-decorator-filter";
import logger from "redux-logger";
import { ConfigureQuerySyncers } from "./syncers";
import { LOADED } from "./modules/storage";
import { hydrateAuth } from "helpers/auth";
const appConfig = require("../../../config/main");

export function configureStore(
  history,
  apolloReducer,
  clientMiddlewares: Middleware[],
  initialState?: IStore
): Store<IStore> {
  let storeEngine = createEngine("state");
  storeEngine = filter(storeEngine, ["pref", ["user", "session", "JWT"]]);
  const storageMiddleware = storage.createMiddleware(storeEngine);
  const reducer = storage.reducer(getReducers(apolloReducer, history));

  const middlewares: Middleware[] = [
    routerMiddleware(history),
    thunk,
    storageMiddleware,
    ...clientMiddlewares,
  ];

  /** Add Only Dev. Middlewares */
  if (appConfig.env !== "production" && process.env.BROWSER) {
    middlewares.push(logger);
  }

  const composeEnhancers =
    (appConfig.env !== "production" &&
      typeof window === "object" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store: Store<IStore> = createStore<IStore, any, any, any>(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (appConfig.env === "development" && (module as any).hot) {
    (module as any).hot.accept("./reducers", () => {
      store.replaceReducer(require("./reducers"));
    });
  }

  const load = storage.createLoader(storeEngine);
  load(store).then(
    async () => {
      await hydrateAuth(store.dispatch, store.getState);
      ConfigureQuerySyncers(store);
      store.dispatch({
        type: LOADED,
      });
    },
    (e) => {
      console.error("Failed to load previous state: " + e);
    }
  );

  return store;
}
