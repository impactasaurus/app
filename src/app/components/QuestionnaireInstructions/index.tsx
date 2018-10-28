import * as React from 'react';
import {Button} from 'semantic-ui-react';
import './style.less';

interface IProps {
  title?: string;
  text: string;
  onNext: () => void;
}

class QuestionnaireInstructions extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className="questionnaire-instructions">
        <h1 className="close">{this.props.title || ''}</h1>
        <h3>{this.props.text}</h3>
        <Button onClick={this.props.onNext}>Next</Button>
      </div>
    );
  }
}

export {QuestionnaireInstructions};
