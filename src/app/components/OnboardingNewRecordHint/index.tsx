import * as React from 'react';
import {getRecentMeetings, IGetRecentMeetings} from '../../apollo/modules/meetings';
import {allOutcomeSets,IOutcomeResult} from 'apollo/modules/outcomeSets';
import {Message} from 'semantic-ui-react';

interface IProps {
  meetings?: IGetRecentMeetings;
  data?: IOutcomeResult;
}

const inner = (p: IProps) => {
  const loading = p.data.loading || p.meetings.loading;
  if (loading) {
    return (<div />);
  }
  const hasOneQuestionnaire = p.data.allOutcomeSets &&
    p.data.allOutcomeSets.length === 1;
  const hasNoRecords = p.meetings.getRecentMeetings &&
    p.meetings.getRecentMeetings.meetings &&
    p.meetings.getRecentMeetings.meetings.length === 0;
  if (!hasOneQuestionnaire || !hasNoRecords) {
    return (<div />);
  }
  return (
    <Message info={true} className="new-record-signpost">
      <Message.Header>What next?</Message.Header>
      <p>Collect answers from your beneficiaries, these are stored as records in the system.</p>
      <p>Press the plus button in the header to get started.</p>
    </Message>
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
