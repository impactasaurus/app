import { combineReducers, Reducer } from "redux";
import { reducer as pref } from "redux/modules/pref";
import { reducer as user } from "redux/modules/user";
import { reducer as storage } from "redux/modules/storage";
import { reducer as tour } from "redux/modules/tour";
import { connectRouter } from "connected-react-router";

export default function getReducers(apollo, history): Reducer {
  const internalReducers = {
    pref,
    user,
    storage,
    tour,
  };
  return combineReducers({
    router: connectRouter(history),
    ...internalReducers,
    apollo,
  });
}
