export const NEW_REPORT = 'NEW_REPORT';
export const EXCLUDE_BEN = 'EXCLUDE_BEN';
export const INCLUDE_BEN = 'INCLUDE_BEN';

interface INewReportAction extends Redux.Action {
  type: string;
  payload: {
    questionnaire: string;
    start: Date;
    end: Date;
    tags: string[];
  };
}

interface IBenAction extends Redux.Action {
  type: string;
  payload: {
    beneficiary: string;
  };
}

type Action = INewReportAction|IBenAction;

function isNewReportAction(action: Action): action is INewReportAction {
  return action.type === NEW_REPORT;
}

function isBenAction(action: Action): action is IBenAction {
  return action.type === EXCLUDE_BEN || action.type === INCLUDE_BEN;
}

export interface IState {
  questionnaire: string;
  start: string;
  end: string;
  tags: string[];
  excludedBens: string[];
}

const initialState: IState = {
  questionnaire: '',
  start: '',
  end: '',
  tags: [],
  excludedBens: [],
};

function benActionReducer(state: IState, action: IBenAction): IState {
  const newState: IState = Object.assign({}, state);
  newState.excludedBens = state.excludedBens.slice();
  newState.tags = state.tags.slice();
  switch (action.type) {
    case EXCLUDE_BEN:
      newState.excludedBens.push(action.payload.beneficiary);
      break;
    case INCLUDE_BEN:
      newState.excludedBens = newState.excludedBens.filter((b) => b !== action.payload.beneficiary);
      break;
    default:
  }
  return newState;
}

function newReportReducer(action: INewReportAction): IState {
  return {
    start : action.payload.start.toISOString(),
    end: action.payload.end.toISOString(),
    tags: action.payload.tags,
    questionnaire: action.payload.questionnaire,
    excludedBens: [],
  };
}

export function reducer(state: IState = initialState, action: Action) {
  if (isBenAction(action)) {
    return benActionReducer(state, action);
  }
  if(isNewReportAction(action)) {
    return newReportReducer(action);
  }
  return state;
}

export function excludeBen(benID: string): IBenAction {
  return {
    type: EXCLUDE_BEN,
    payload: {
      beneficiary: benID,
    },
  };
}

export function includeBen(benID: string): IBenAction {
  return {
    type: INCLUDE_BEN,
    payload: {
      beneficiary: benID,
    },
  };
}
export type BenFunc = (benID: string) => IBenAction;

export function newReport(questionnaire: string, start: Date, end: Date, tags: string[]): INewReportAction {
  return {
    type: NEW_REPORT,
    payload: {
      questionnaire,
      start,
      end,
      tags,
    },
  };
}
