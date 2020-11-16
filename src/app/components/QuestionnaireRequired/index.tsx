import * as React from 'react';
import {allOutcomeSets, IOutcomeResult} from 'apollo/modules/outcomeSets';
import { Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {getQuestions} from 'helpers/questionnaire';

interface IProp {
  data?: IOutcomeResult;
}

const renderQuestionnaireNeeded = (action: string): JSX.Element => ((
  <Segment id="questionnaire-needed" raised={true} compact={true} style={{marginLeft:'auto',marginRight:'auto'}}>
    <h3>
      We love the enthusiasm!
    </h3>
    <p>Before we {action}, let's first define a questionnaire</p>
    <p>Head over to the <Link to="/questions">questionnaire page</Link> to create one</p>
  </Segment>
));

const renderQuestionsNeeded = (action: string): JSX.Element => ((
  <Segment id="questionnaire-needed" raised={true} compact={true} style={{marginLeft:'auto',marginRight:'auto'}}>
    <h3>
      We love the enthusiasm!
    </h3>
    <p>Before we {action}, let's first define some questions within your questionnaire</p>
    <p>Head over to the <Link to="/questions">questionnaire page</Link> to add some questions</p>
  </Segment>
));

export const QuestionnaireRequired = <P extends object>(action: string, WrappedComponent: React.ComponentType<P>) => {
  class Inner extends React.Component<P & IProp, any> {
    public render() {
      if (Array.isArray(this.props.data.allOutcomeSets)) {
        if (this.props.data.allOutcomeSets.length === 0) {
          return renderQuestionnaireNeeded(action);
        }
        const noQuestions = this.props.data.allOutcomeSets.reduce((max, q) => Math.max(max, getQuestions(q).length), 0);
        if (noQuestions === 0) {
          return renderQuestionsNeeded(action);
        }
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return allOutcomeSets<P & IProp>(Inner);
};
