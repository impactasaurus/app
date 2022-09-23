import React, { useEffect } from "react";
import { IOutcomeResult, allOutcomeSets } from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import { setPref, SetPrefFunc } from "redux/modules/pref";
import { IStore } from "redux/IStore";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QuestionnaireKey, getSelectedQuestionSetID } from "models/pref";
import { BasicQuestionnaireSelector } from "./basic";

interface IExternalProps {
  allowedQuestionSetIDs?: string[];
  autoSelectFirst?: boolean;
  inputID?: string;
  onBlur?: () => void;
  onQuestionSetSelected?: (qsID: string) => void;
}

interface IProp extends IExternalProps {
  data?: IOutcomeResult;
  selectedQuestionSetID?: string;
  setPref?: SetPrefFunc;
  allowedQuestionSets?: IOutcomeSet[];
}

export const stateInURLRegex =
  /(\/beneficiary\/[^/]*\/journey|\/beneficiary\/[^/]*$|\/beneficiary\/[^/]*\/$)/;

const isQuestionSetAllowed = (qsID: string, props: IProp): boolean => {
  const isAllowed =
    Array.isArray(props.allowedQuestionSetIDs) === false ||
    props.allowedQuestionSetIDs.indexOf(qsID) !== -1;
  const isKnown =
    Array.isArray(props.data.allOutcomeSets) === false ||
    props.data.allOutcomeSets.map((q) => q.id).indexOf(qsID) !== -1;
  return isAllowed && isKnown;
};

const getSelectedAndAllowedQuestionSetID = (
  state: IStore,
  ownProps: IProp
): string | undefined => {
  const selectedQuestionSet = getSelectedQuestionSetID(state.pref);
  if (selectedQuestionSet === undefined) {
    return undefined;
  }
  if (isQuestionSetAllowed(selectedQuestionSet, ownProps) === false) {
    return undefined;
  }
  return selectedQuestionSet;
};

const getAllowedQuestionSets = (ownProps: IProp): IOutcomeSet[] | undefined => {
  if (Array.isArray(ownProps.data.allOutcomeSets) === false) {
    return undefined;
  }
  return ownProps.data.allOutcomeSets.filter((os): boolean => {
    return isQuestionSetAllowed(os.id, ownProps);
  });
};

const QuestionSetSelectInner = (p: IProp) => {
  const setQuestionSetID = (qID: string) => {
    p.setPref(QuestionnaireKey, qID);
  };

  useEffect(() => {
    const { selectedQuestionSetID, allowedQuestionSets, autoSelectFirst } = p;
    if (
      selectedQuestionSetID === undefined &&
      autoSelectFirst === true &&
      Array.isArray(allowedQuestionSets) &&
      allowedQuestionSets.length > 0
    ) {
      setQuestionSetID(allowedQuestionSets[0].id);
    }
    if (p.onQuestionSetSelected !== undefined) {
      p.onQuestionSetSelected(selectedQuestionSetID);
    }
  }, [p.selectedQuestionSetID, p.allowedQuestionSets, p.autoSelectFirst]);

  return (
    <BasicQuestionnaireSelector
      inputID={p.inputID}
      onChange={setQuestionSetID}
      onBlur={p.onBlur}
      questionnaireID={p.selectedQuestionSetID}
      allowedQuestionSetIDs={p.allowedQuestionSetIDs}
    />
  );
};

const storeToProps = (state: IStore, ownProps: IProp) => {
  return {
    selectedQuestionSetID: getSelectedAndAllowedQuestionSetID(state, ownProps),
    allowedQuestionSets: getAllowedQuestionSets(ownProps),
  };
};

const dispatchToProps = (dispatch) => ({
  setPref: bindActionCreators(setPref, dispatch),
});

const QuestionSetSelectConnected = connect(
  storeToProps,
  dispatchToProps
)(QuestionSetSelectInner);
const QuestionSetSelect = allOutcomeSets<IProp>(QuestionSetSelectConnected);
export { QuestionSetSelect };
