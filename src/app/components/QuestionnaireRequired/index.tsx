import * as React from 'react';
import {allOutcomeSets, IOutcomeResult} from 'apollo/modules/outcomeSets';
import { Message } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

interface IProp {
  data?: IOutcomeResult;
}

const renderQuestionnaireNeeded = (): JSX.Element => ((
  <Message warning={true}>
    <Message.Header>Questionnaire Required</Message.Header>
    <p>To create a record, you first need to define a questionnaire</p>
    <p>Head over to the <Link to="/questions">questionnaire page</Link> to create one</p>
  </Message>
));

export const QuestionnaireRequired = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  class Inner extends React.Component<P & IProp, any> {
    public render() {
      if (this.props.data.allOutcomeSets && this.props.data.allOutcomeSets.length === 0) {
        return renderQuestionnaireNeeded();
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return allOutcomeSets<P & IProp>(Inner);
};
