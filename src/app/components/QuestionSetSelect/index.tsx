import React, { useEffect } from "react";
import { IOutcomeResult, allOutcomeSets } from "apollo/modules/outcomeSets";
import { IOutcomeSet } from "models/outcomeSet";
import { Select, DropdownItemProps } from "semantic-ui-react";
import { setPref, SetPrefFunc } from "redux/modules/pref";
import { IStore } from "redux/IStore";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QuestionnaireKey, getSelectedQuestionSetID } from "models/pref";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const setQuestionSetID = (_, data) => {
    p.setPref(QuestionnaireKey, data.value);
  };

  useEffect(() => {
    const { selectedQuestionSetID, allowedQuestionSets, autoSelectFirst } = p;
    if (
      selectedQuestionSetID === undefined &&
      autoSelectFirst === true &&
      Array.isArray(allowedQuestionSets) &&
      allowedQuestionSets.length > 0
    ) {
      setQuestionSetID(
        {},
        {
          value: allowedQuestionSets[0].id,
        }
      );
    }
    if (p.onQuestionSetSelected !== undefined) {
      p.onQuestionSetSelected(selectedQuestionSetID);
    }
  }, [p.selectedQuestionSetID, p.allowedQuestionSets, p.autoSelectFirst]);

  const getOptions = (oss: IOutcomeSet[]): DropdownItemProps[] => {
    if (!Array.isArray(oss)) {
      return [];
    }
    return oss.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
  };

  const selectProps: any = {};
  if (p.data.loading) {
    selectProps.loading = true;
    selectProps.disabled = true;
  }

  return (
    <Select
      id={p.inputID}
      className="qs-selector"
      {...selectProps}
      value={p.selectedQuestionSetID}
      placeholder={t("Questionnaire")}
      onChange={setQuestionSetID}
      onBlur={p.onBlur}
      options={getOptions(p.allowedQuestionSets)}
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
