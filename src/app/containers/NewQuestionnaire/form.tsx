import {bindActionCreators} from 'redux';
import * as React from 'react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {IOutcomeSet} from 'models/outcomeSet';
import {INewQuestionnaire, NewQuestionnaireForm as NQF} from 'components/NewQuestionnaireForm';
import {IOutcomeMutation, newQuestionSet} from 'apollo/modules/outcomeSets';
import {PageWrapperHoC} from 'components/PageWrapperHoC';

const { connect } = require('react-redux');

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class NewQuestionnaireFormInner extends React.Component<IOutcomeMutation & IURLConnector, any> {
  constructor(props) {
    super(props);
    this.goToQuestionnaire = this.goToQuestionnaire.bind(this);
    this.goToTypeSelection = this.goToTypeSelection.bind(this);
    this.createQS = this.createQS.bind(this);
  }

  private createQS(q: INewQuestionnaire) {
    return this.props.newQuestionSet(q.name, q.description)
      .then(this.goToQuestionnaire);
  }

  private goToQuestionnaire(q: IOutcomeSet) {
    this.props.setURL(`/questions/${q.id}/questions`);
  }

  private goToTypeSelection() {
    this.props.setURL(`/questions/new`);
  }

  public render() {
    return (
      <NQF
        onCancel={this.goToTypeSelection}
        submit={this.createQS}
      />
    );
  }
}

export const NewQuestionnaireForm = newQuestionSet(PageWrapperHoC('Custom Questionnaire', 'new-questionnaire-form', NewQuestionnaireFormInner));
