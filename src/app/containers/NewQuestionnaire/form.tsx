import * as React from 'react';
import {IURLConnector, UrlHOC} from 'redux/modules/url';
import {IOutcomeSet} from 'models/outcomeSet';
import {INewQuestionnaire, NewQuestionnaireForm as NQF} from 'components/NewQuestionnaireForm';
import {IOutcomeMutation, newQuestionSet} from 'apollo/modules/outcomeSets';
import {PageWrapperHoC} from 'components/PageWrapperHoC';

const NewQuestionnaireFormInner = (p: IOutcomeMutation & IURLConnector) => {

  const goToQuestionnaire = (q: IOutcomeSet) => {
    p.setURL(`/questions/${q.id}/questions`);
  }

  const goToTypeSelection = () => {
    p.setURL(`/questions/new`);
  }

  const createQS = (q: INewQuestionnaire) => {
    return p.newQuestionSet(q.name, q.description)
      .then(goToQuestionnaire);
  }

  return (
    <NQF
      onCancel={goToTypeSelection}
      submit={createQS}
    />
  );
}

const NewQuestionnaireFormConnected = UrlHOC(NewQuestionnaireFormInner);

// t('Custom Questionnaire')
export const NewQuestionnaireForm = newQuestionSet(PageWrapperHoC('Custom Questionnaire', 'new-questionnaire-form', NewQuestionnaireFormConnected));
