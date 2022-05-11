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

export function initialState(
  hasInstructions: boolean,
  numQuestions: number
): IMeetingState {
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

export function getPreviousState(
  current: IMeetingState,
  hasInstructions: boolean
): IMeetingState {
  const noChange = {
    ...current,
  };
  if (current.screen === Screen.REVIEW) {
    return {
      screen: Screen.NOTES,
      qIdx: current.qIdx,
    };
  }
  if (current.screen === Screen.INSTRUCTIONS) {
    return noChange;
  }
  if (current.screen === Screen.NOTES) {
    return {
      screen: Screen.QUESTION,
      qIdx: current.qIdx,
    };
  }
  const firstQuestion = current.qIdx === -1 || current.qIdx === 0;
  if (firstQuestion && hasInstructions) {
    return {
      screen: Screen.INSTRUCTIONS,
      qIdx: current.qIdx,
    };
  }
  if (firstQuestion) {
    return noChange;
  }
  return {
    screen: current.screen,
    qIdx: current.qIdx - 1,
  };
}

export function canGoBack(
  current: IMeetingState,
  hasInstructions: boolean
): boolean {
  const prev = getPreviousState(current, hasInstructions);
  const identical =
    prev.screen === current.screen && prev.qIdx === current.qIdx;
  return !identical;
}

export function getNextState(
  current: IMeetingState,
  noQuestions: number
): IMeetingState {
  if (current.screen === Screen.INSTRUCTIONS) {
    return {
      screen: Screen.QUESTION,
      qIdx: 0,
    };
  }
  if (current.screen === Screen.NOTES) {
    return {
      screen: Screen.REVIEW,
      qIdx: current.qIdx,
    };
  }
  if (noQuestions > current.qIdx + 1) {
    return {
      screen: Screen.QUESTION,
      qIdx: current.qIdx + 1,
    };
  }
  return {
    screen: Screen.NOTES,
    qIdx: current.qIdx,
  };
}
