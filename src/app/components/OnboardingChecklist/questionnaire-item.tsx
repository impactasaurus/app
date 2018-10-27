import * as React from 'react';
import {allOutcomeSets, IOutcomeResult} from '../../apollo/modules/outcomeSets';
import {OnboardingChecklistItem} from './item';
import {IOutcomeSet} from 'models/outcomeSet';
import {getQuestions} from 'helpers/questionnaire';

interface IProps {
  data?: IOutcomeResult;
}

const Inner = (p: IProps) => {
  const loading = p.data.loading;
  let completed = false;
  if (!loading && p.data.allOutcomeSets && p.data.allOutcomeSets.length > 0) {
    const maxQuestionCount = p.data.allOutcomeSets.reduce((max: number, os: IOutcomeSet) => Math.max(max, getQuestions(os).length), 0);
    completed = maxQuestionCount >= 3;
  }
  return (
    <OnboardingChecklistItem
      title="Define a questionnaire"
      description="Questionnaires are used to collect information from your beneficiaries. They should measure the outcomes you wish to achieve. Create a questionnaire with 3 or more questions."
      completed={completed}
      loading={loading}
      link="/questions"
    />
  );
};

export const QuestionnaireChecklistItem = allOutcomeSets(Inner);
