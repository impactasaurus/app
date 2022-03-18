import { Action } from "redux";
import { IStore } from "redux/IStore";
import { useSelector } from "react-redux";

export enum TourStage {
  QUESTIONNAIRE_1 = 1,
  QUESTIONNAIRE_2,
  QUESTIONNAIRE_3,
  RECORD_1,
  RECORD_2,
  RECORD_3,
  RECORD_4,
}

interface IAction extends Action {
  type: string;
  stage?: TourStage;
  conditional?: TourStage;
}

export interface IState {
  active: boolean;
  stage?: TourStage;
}

const initialState: IState = {
  active: false,
};

export function reducer(state: IState = initialState, action: IAction): IState {
  if (action.conditional) {
    if (!state.active || state.stage !== action.conditional) {
      return state;
    }
  }
  switch (action.type) {
    case "ISetStage":
      return {
        ...state,
        stage: action.stage,
        active: true,
      };
    case "IEndTour":
      return {
        ...state,
        stage: undefined,
        active: false,
      };
  }
  return state;
}

export const tourStageAction = (
  stage: TourStage | null,
  conditional?: TourStage
): IAction => {
  if (stage === null) {
    return {
      type: "IEndTour",
      conditional,
    };
  }
  return {
    type: "ISetStage",
    stage: stage,
    conditional,
  };
};

export const useTourActive = (stage: TourStage): boolean => {
  return useSelector(
    (store: IStore) => store.tour.active && store.tour.stage === stage
  );
};
