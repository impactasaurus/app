export const NEW_REPORT = 'NEW_REPORT';
export const EXCLUDE_BEN = 'EXCLUDE_BEN';
export const INCLUDE_BEN = 'INCLUDE_BEN';

export interface INewReportAction extends Redux.Action {
  type: string;
  payload: {
    questionnaire: string;
    start: Date;
    end: Date;
    tags: string[];
  };
}

export interface IBenAction extends Redux.Action {
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
  switch (action.type) {
    case EXCLUDE_BEN:
      newState.excludedBens.push(action.payload.beneficiary);
      break;
    case INCLUDE_BEN:
      newState.excludedBens.filter((b) => b === action.payload.beneficiary);
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
