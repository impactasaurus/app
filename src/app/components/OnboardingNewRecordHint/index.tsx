import * as React from 'react';
import {getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';
import {allOutcomeSets,IOutcomeResult} from 'apollo/modules/outcomeSets';
import {OnboardingChecklist} from 'components/OnboardingChecklist';

interface IProps {
  meetings?: IGetRecentMeetings;
  data?: IOutcomeResult;
}

const inner = (p: IProps) => {
  const loading = p.data.loading || p.meetings.loading;
  if (loading) {
    return (<div />);
  }
  const hasAtleastOneQuestionniare = p.data.allOutcomeSets &&
    p.data.allOutcomeSets.length >= 1;
  const hasNoRecords = p.meetings.getRecentMeetings &&
    p.meetings.getRecentMeetings.meetings &&
    p.meetings.getRecentMeetings.meetings.length === 0;
  const shouldShow = hasNoRecords && hasAtleastOneQuestionniare;
  if (!shouldShow) {
    return (<div />);
  }
  return (
    <OnboardingChecklist dismissible={false} minimal={true} customHeader={
      <>
        <h2>What next?</h2>
        <p>Your questionnaire has been added to your account. Answer the questions to create your first record.</p>
      </>
    }/>
  );
};

const Component = (p: IProps) => {
  // this is best effort
  try {
    return inner(p);
  } catch {
    return (<div />);
  }
};

export const OnboardingNewRecordHint = allOutcomeSets(getRecentMeetings(() => 0, 'meetings')(Component));
