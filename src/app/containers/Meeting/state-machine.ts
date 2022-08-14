export enum Screen {
  EMPTY,
  INSTRUCTIONS,
  QUESTION,
  NOTES,
  FINALISE,
  THANKS,
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
  if (
    current.screen === Screen.INSTRUCTIONS ||
    current.screen === Screen.FINALISE
  ) {
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
  noQuestions: number,
  notesDeactivated: boolean
): IMeetingState {
  if (current.screen === Screen.INSTRUCTIONS) {
    return {
      screen: Screen.QUESTION,
      qIdx: 0,
    };
  }
  if (current.screen === Screen.NOTES) {
    return {
      screen: Screen.FINALISE,
      qIdx: current.qIdx,
    };
  }
  if (noQuestions > current.qIdx + 1) {
    return {
      screen: Screen.QUESTION,
      qIdx: current.qIdx + 1,
    };
  }
  const noteState = {
    screen: Screen.NOTES,
    qIdx: current.qIdx,
  };
  return notesDeactivated === true
    ? getNextState(noteState, noQuestions, notesDeactivated)
    : noteState;
}
