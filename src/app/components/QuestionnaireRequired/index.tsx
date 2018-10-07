import * as React from 'react';
import {allOutcomeSets, IOutcomeResult} from 'apollo/modules/outcomeSets';
import { Message } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {getQuestions} from 'helpers/questionnaire';

interface IProp {
  data?: IOutcomeResult;
}

const renderQuestionnaireNeeded = (action: string): JSX.Element => ((
  <Message warning={true}>
    <Message.Header>Questionnaire Required</Message.Header>
    <p>{action}, you first need to define a questionnaire</p>
    <p>Head over to the <Link to="/questions">questionnaire page</Link> to create one</p>
  </Message>
));

const renderQuestionsNeeded = (action: string): JSX.Element => ((
  <Message warning={true}>
    <Message.Header>Questions Required</Message.Header>
    <p>{action}, you first need to define some questions within your questionnaire</p>
    <p>Head over to the <Link to="/questions">questionnaire page</Link> to add some questions</p>
  </Message>
));

export const QuestionnaireRequired = <P extends object>(action: string, WrappedComponent: React.ComponentType<P>) => {
  class Inner extends React.Component<P & IProp, any> {
    public render() {
      if (this.props.data.allOutcomeSets && this.props.data.allOutcomeSets.length === 0) {
        return renderQuestionnaireNeeded(action);
      }
      const noQuestions = this.props.data.allOutcomeSets.reduce((max, q) => Math.max(max, getQuestions(q).length), 0);
      if (noQuestions === 0) {
        return renderQuestionsNeeded(action);
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return allOutcomeSets<P & IProp>(Inner);
};
