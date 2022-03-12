import { Action } from "redux";
import { IStore } from "redux/IStore";

export enum TourStage {
  QUESTIONNAIRE_1 = 1,
  QUESTIONNAIRE_2,
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
  switch (action.type) {
    case "ISetStage":
      if (action.conditional) {
        if (!state.active || state.stage !== action.conditional) {
          return state;
        }
      }
      return {
        ...state,
        stage: action.stage,
        active: true,
      };
    case "IEndTour":
      return {
        ...state,
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
    };
  }
  return {
    type: "ISetStage",
    stage: stage,
    conditional,
  };
};

export const isTourActive = (
  stage: TourStage
): ((state: IStore) => boolean) => {
  return (state: IStore): boolean => {
    return state.tour.active && state.tour.stage === stage;
  };
};
