import * as React from 'react';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import { Select, SelectProps, DropdownItemProps } from 'semantic-ui-react';
import {setPref, SetPrefFunc} from 'modules/pref';
import {IStore} from 'redux/IStore';
const { connect } = require('react-redux');
import { bindActionCreators } from 'redux';
import {SelectedQuestionSetIDKey, getSelectedQuestionSetID} from 'models/pref';

interface IProp {
  data?: IOutcomeResult;
  selectedQuestionSetID?: string;
  setPref?: SetPrefFunc;
  onQuestionSetSelected?: (qsID: string) => void;
  allowedQuestionSetIDs?: string[];
  autoSelectFirst?: boolean;
}

@connect((state: IStore) => {
  return {
    selectedQuestionSetID: getSelectedQuestionSetID(state.pref),
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
    return oss.filter((os) => {
      if(Array.isArray(this.props.allowedQuestionSetIDs)) {
        return this.props.allowedQuestionSetIDs.indexOf(os.id) !== -1;
      }
      return true;
    }).map((os) => {
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
      Array.isArray(nextProps.data.allOutcomeSets) &&
      nextProps.data.allOutcomeSets.length > 0) {
        this.setQuestionSetID({}, {
          value: nextProps.data.allOutcomeSets[0].id,
        });
    }
    if (this.props.onQuestionSetSelected !== undefined) {
      this.props.onQuestionSetSelected(nextProps.selectedQuestionSetID);
    }
  }

  private setQuestionSetID(_, data) {
    this.props.setPref(SelectedQuestionSetIDKey, data.value);
  }

  private getSelectedQuestionSetID(p: IProp): string|undefined {
    const questionSetIDs = this.getOptions(p.data.allOutcomeSets).map((di) => di.key);
    return questionSetIDs.find((qs) => qs === p.selectedQuestionSetID);
  }

  public render() {
    const { data } = this.props;
    const selectProps: SelectProps = {};
    if (data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <Select
        className="qs-selector"
        {...selectProps}
        value={this.getSelectedQuestionSetID(this.props)}
        placeholder="Question Set"
        onChange={this.setQuestionSetID}
        options={this.getOptions(data.allOutcomeSets)}
      />
    );
  }
}

const QuestionSetSelect = allOutcomeSets<IProp>(QuestionSetSelectInner);
export {QuestionSetSelect}
