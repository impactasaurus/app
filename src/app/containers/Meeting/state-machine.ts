export enum Screen {
  QUESTION,
  NOTES,
  REVIEW,
  INSTRUCTIONS,
  THANKS,
  EMPTY,
}

export interface IMeetingState {
  screen: Screen;
  qIdx: number;
}

export function initialState(hasInstructions: boolean, numQuestions: number): IMeetingState {
  if (numQuestions === 0) {
    return {
      screen: Screen.EMPTY,
      qIdx: 0,
    };
  }
  if (hasInstructions) {
    return {
      screen: Screen.INSTRUCTIONS,
      qIdx: 0,
    };
  }
  return {
    screen: Screen.QUESTION,
    qIdx: 0,
  };
}

export function getPreviousState(current: Screen, qIdx: number, hasInstructions: boolean): IMeetingState {
  const noChange = {
    screen: current,
    qIdx,
  };
  if (current === Screen.REVIEW) {
    return {
      screen: Screen.NOTES,
      qIdx,
    };
  }
  if (current === Screen.INSTRUCTIONS) {
    return noChange;
  }
  if (current === Screen.NOTES) {
    return {
      screen: Screen.QUESTION,
      qIdx,
    };
  }
  const firstQuestion = qIdx === -1 || qIdx === 0;
  if (firstQuestion && hasInstructions) {
    return {
      screen: Screen.INSTRUCTIONS,
      qIdx,
    };
  }
  if (firstQuestion) {
    return noChange;
  }
  return {
    screen: current,
    qIdx: qIdx - 1,
  };
}

export function canGoBack(current: Screen, qIdx: number, hasInstructions: boolean): boolean {
  const prev = getPreviousState(current, qIdx, hasInstructions);
  const identical = prev.screen === current && prev.qIdx === qIdx;
  return !identical;
}

export function getNextState(current: Screen, qIdx: number, noQuestions: number): IMeetingState {
  if (current === Screen.INSTRUCTIONS) {
    return {
      screen: Screen.QUESTION,
      qIdx: 0,
    };
  }
  if (current === Screen.NOTES) {
    return {
      screen: Screen.REVIEW,
      qIdx,
    };
  }
  if (noQuestions > qIdx + 1) {
    return {
      screen: Screen.QUESTION,
      qIdx: qIdx + 1,
    };
  }
  return {
    screen: Screen.NOTES,
    qIdx,
  };
}
