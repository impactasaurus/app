import * as React from 'react';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import { Select, SelectProps, DropdownItemProps } from 'semantic-ui-react';
import {setPref, SetPrefFunc} from 'modules/pref';
import {IStore} from 'redux/IStore';
const { connect } = require('react-redux');
import { bindActionCreators } from 'redux';
import {SelectedQuestionSetIDKey, getSelectedQuestionSetID} from 'models/pref';

interface IExternalProps {
  allowedQuestionSetIDs?: string[];
  autoSelectFirst?: boolean;
}

interface IProp extends IExternalProps {
  data?: IOutcomeResult;
  selectedQuestionSetID?: string;
  setPref?: SetPrefFunc;
  onQuestionSetSelected?: (qsID: string) => void;
  allowedQuestionSets?: IOutcomeSet[];
}

const isQuestionSetAllowed = (qsID: string, props: IProp): boolean => {
  return Array.isArray(props.allowedQuestionSetIDs) === false ||
    props.allowedQuestionSetIDs.indexOf(qsID) !== -1;
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

  public componentWillReceiveProps(nextProps: IProp) {
    if (nextProps.selectedQuestionSetID === undefined &&
      nextProps.autoSelectFirst === true &&
      Array.isArray(nextProps.allowedQuestionSets) &&
      nextProps.allowedQuestionSets.length > 0) {
        this.setQuestionSetID({}, {
          value: nextProps.allowedQuestionSets[0].id,
        });
    }
    if (this.props.onQuestionSetSelected !== undefined) {
      this.props.onQuestionSetSelected(nextProps.selectedQuestionSetID);
    }
  }

  private setQuestionSetID(_, data) {
    this.props.setPref(SelectedQuestionSetIDKey, data.value);
  }

  public render() {
    const selectProps: SelectProps = {};
    if (this.props.data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <Select
        className="qs-selector"
        {...selectProps}
        value={this.props.selectedQuestionSetID}
        placeholder="Questionnaire"
        onChange={this.setQuestionSetID}
        options={this.getOptions(this.props.allowedQuestionSets)}
      />
    );
  }
}

const QuestionSetSelect = allOutcomeSets<IProp>(QuestionSetSelectInner);
export {QuestionSetSelect}
