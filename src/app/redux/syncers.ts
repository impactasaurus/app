import { Store } from "redux";
import { IStore } from "./IStore";
import { ReduxQuerySync } from "./querySync";
import { sync as VizControlPanelSync } from "components/VizControlPanel/urlParamSync";
import { sync as QuestionnaireSync } from "components/QuestionSetSelect/urlParamSync";

export const ConfigureQuerySyncers = (store: Store<IStore>) => {
  ReduxQuerySync(store, {
    ...VizControlPanelSync,
    ...QuestionnaireSync,
  });
};
