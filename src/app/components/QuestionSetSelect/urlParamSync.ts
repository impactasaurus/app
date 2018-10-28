import {QuestionnaireKey, getSelectedQuestionSetID} from 'models/pref';
import {IParams} from 'redux/querySync';
import {IStore} from 'redux/IStore';
import {setPref} from 'redux/modules/pref';
import {stateInURLRegex} from './index';

export const sync: IParams = {
  [QuestionnaireKey]: {
    selector: (store: IStore) => getSelectedQuestionSetID(store.pref),
    action: (value) => setPref(QuestionnaireKey, value),
    stringToValue: (s) => s,
    valueToString: (v) => v,
    setSearchParam: (s: IStore) => stateInURLRegex.test(s.router.location.pathname),
  },
};
