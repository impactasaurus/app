import * as React from 'react';
import {allOutcomeSets, IOutcomeResult} from 'apollo/modules/outcomeSets';
import { Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {getQuestions} from 'helpers/questionnaire';
import {Trans} from 'react-i18next';

interface IProp {
  data?: IOutcomeResult;
}

const renderQuestionnaireNeeded = (): JSX.Element => ((
  <Segment id="questionnaire-needed" raised={true} compact={true} style={{marginLeft:'auto',marginRight:'auto'}}>
    <Trans
      defaults="<h>We love the enthusiasm!</h><p>But before that, let's define a questionnaire</p><p>Head over to the <qLink>questionnaires page</qLink> to create one</p>"
      components={{
        h: <h3 />,
        p: <p />,
        qLink: <Link to="/questions" />
      }}
    />
  </Segment>
));

const renderQuestionsNeeded = (): JSX.Element => ((
  <Segment id="questionnaire-needed" raised={true} compact={true} style={{marginLeft:'auto',marginRight:'auto'}}>
    <Trans
      defaults="<h>We love the enthusiasm!</h><p>But before that, let's define some questions within your questionnaire</p><p>Head over to the <qLink>questionnaires page</qLink> to add some questions</p>"
      components={{
        h: <h3 />,
        p: <p />,
        qLink: <Link to="/questions" />
      }}
    />
  </Segment>
));

export const QuestionnaireRequired = <P extends unknown>(WrappedComponent: React.ComponentType<P>): React.ComponentClass<P & IProp> => {
  class Inner extends React.Component<P & IProp, null> {
    public render() {
      if (Array.isArray(this.props.data.allOutcomeSets)) {
        if (this.props.data.allOutcomeSets.length === 0) {
          return renderQuestionnaireNeeded();
        }
        const noQuestions = this.props.data.allOutcomeSets.reduce((max, q) => Math.max(max, getQuestions(q).length), 0);
        if (noQuestions === 0) {
          return renderQuestionsNeeded();
        }
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return allOutcomeSets<P & IProp>(Inner);
};
