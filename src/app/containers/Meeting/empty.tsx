import * as React from 'react';
import {questionnaireURI} from 'helpers/url';
import {CustomError} from 'components/Error';
import {Link} from 'react-router-dom';

interface IProps {
  questionnaireID: string;
  isBeneficiary: boolean;
}

export class EmptyQuestionnaire extends React.Component<IProps, any> {
  public render() {
    let inner = (
      <span>The questionnaire seems to be empty, <Link to={questionnaireURI(this.props.questionnaireID)}>please try adding some questions</Link></span>
    );
    if (this.props.isBeneficiary) {
      inner = <span>Sorry, this questionnaire is empty. Please contact your facilitator</span>;
    }
    return (
      <CustomError inner={inner} />
    );
  }
}
