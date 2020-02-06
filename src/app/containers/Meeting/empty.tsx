import * as React from 'react';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {questionnaire} from 'helpers/url';
import {CustomError} from 'components/Error';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  questionnaireID: string;
  isBeneficiary: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
export class EmptyQuestionnaire extends React.Component<IProps, any> {

  private navigateToQuestionnaire = function(qID: string): () => void {
    return () => questionnaire(this.props.setURL, qID);
  };

  public render() {
    let inner = (
      <span>The questionnaire seems to be empty, <a onClick={this.navigateToQuestionnaire(this.props.questionnaireID)}>please try adding some questions</a></span>
    );
    if (this.props.isBeneficiary) {
      inner = <span>Sorry, this questionnaire is empty. Please contact your facilitator</span>;
    }
    return (
      <CustomError inner={inner} />
    );
  }
}
