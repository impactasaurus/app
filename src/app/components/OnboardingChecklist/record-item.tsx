import * as React from 'react';
import {OnboardingChecklistItem} from './item';
import {getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';

interface IProps {
  data?: IGetRecentMeetings;
}

const Inner = (p: IProps) => {
  const loading = p.data.loading;
  const completed = !loading && p.data.getRecentMeetings && p.data.getRecentMeetings.meetings.length > 0;
  return (
    <OnboardingChecklistItem
      title="Create a record"
      description="When a questionnaire is completed, it creates a record within the system. This record is stored against the beneficiary which completed the questionnaire. Complete a questionnaire to create your first record."
      completed={completed}
      loading={loading}
      link="/record"
    />
  );
};

export const RecordChecklistItem = getRecentMeetings(() => 0)(Inner);
