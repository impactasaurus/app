import * as React from 'react';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import { Select, DropdownItemProps } from 'semantic-ui-react';
import {setPref, SetPrefFunc} from 'redux/modules/pref';
import {IStore} from 'redux/IStore';
const { connect } = require('react-redux');
import { bindActionCreators } from 'redux';
import {QuestionnaireKey, getSelectedQuestionSetID} from 'models/pref';

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

export const stateInURLRegex = /(\/beneficiary\/[^/]*\/journey|\/beneficiary\/[^/]*$|\/beneficiary\/[^/]*\/$)/;

const isQuestionSetAllowed = (qsID: string, props: IProp): boolean => {
  const isAllowed = Array.isArray(props.allowedQuestionSetIDs) === false ||
    props.allowedQuestionSetIDs.indexOf(qsID) !== -1;
  const isKnown = Array.isArray(props.data.allOutcomeSets) === false ||
    props.data.allOutcomeSets.map((q) => q.id).indexOf(qsID) !== -1;
  return  isAllowed && isKnown;
};

const getSelectedAndAllowedQuestionSetID = (state: IStore, ownProps: IProp): string|undefined => {
  const selectedQuestionSet = getSelectedQuestionSetID(state.pref);
  if (selectedQuestionSet === undefined) {
    return undefined;
  }
  if (isQuestionSetAllowed(selectedQuestionSet, ownProps) === false) {
      return undefined;
  }
  return selectedQuestionSet;
};

const getAllowedQuestionSets = (ownProps: IProp): IOutcomeSet[]|undefined => {
  if (Array.isArray(ownProps.data.allOutcomeSets) === false) {
    return undefined;
  }
  return ownProps.data.allOutcomeSets.filter((os): boolean => {
    return isQuestionSetAllowed(os.id, ownProps);
  });
};

@connect((state: IStore, ownProps: IProp) => {
  return {
    selectedQuestionSetID: getSelectedAndAllowedQuestionSetID(state, ownProps),
    allowedQuestionSets: getAllowedQuestionSets(ownProps),
  };
}, (dispatch) => ({
  setPref: bindActionCreators(setPref, dispatch),
}))
class QuestionSetSelectInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  private getOptions(oss: IOutcomeSet[]): DropdownItemProps[] {
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
  }

  public componentDidUpdate() {
    const {selectedQuestionSetID, allowedQuestionSets, autoSelectFirst} = this.props;
    if (selectedQuestionSetID === undefined && autoSelectFirst === true &&
      Array.isArray(allowedQuestionSets) && allowedQuestionSets.length > 0) {
        this.setQuestionSetID({}, {
          value: allowedQuestionSets[0].id,
        });
    }
    if (this.props.onQuestionSetSelected !== undefined) {
      this.props.onQuestionSetSelected(selectedQuestionSetID);
    }
  }

  private setQuestionSetID(_, data) {
    this.props.setPref(QuestionnaireKey, data.value);
  }

  public render() {
    const selectProps: any = {};
    if (this.props.data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <Select
        id={this.props.inputID}
        className="qs-selector"
        {...selectProps}
        value={this.props.selectedQuestionSetID}
        placeholder="Questionnaire"
        onChange={this.setQuestionSetID}
        onBlur={this.props.onBlur}
        options={this.getOptions(this.props.allowedQuestionSets)}
      />
    );
  }
}

const QuestionSetSelect = allOutcomeSets<IProp>(QuestionSetSelectInner);
export {QuestionSetSelect};
