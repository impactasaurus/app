import * as React from 'react';
import {RecordChecklistItem} from './record-item';
import {QuestionnaireChecklistItem} from './questionnaire-item';
import {Segment, Divider} from 'semantic-ui-react';

export class OnboardingChecklist extends React.Component<any, any> {
  public render() {
    return (
      <Segment id="onboarding-checklist" raised={true}>
        <h1>Welcome!</h1>
        <p>
          To start understanding your impact, complete the following two steps
        </p>
        <Divider fitted={true} />
        <QuestionnaireChecklistItem />
        <RecordChecklistItem />
      </Segment>
    );
  }
}
