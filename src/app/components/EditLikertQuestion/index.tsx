import * as React from 'react';
import {IQuestionMutation, editLikertQuestion} from 'apollo/modules/questions';
import {IOutcomeSet} from 'models/outcomeSet';
import {LikertQuestionForm} from '../LikertQuestionForm/index';
import {ILikertQuestionForm, Question} from 'models/question';

interface IProps extends IQuestionMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  question: Question;
}

class EditLikertQuestionInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.editQuestion = this.editQuestion.bind(this);
  }

  private editQuestion(q: ILikertQuestionForm): Promise<IOutcomeSet> {
    return this.props.editLikertQuestion(this.props.QuestionSetID, this.props.question.id, q.question, q.minLabel, q.maxLabel, q.description, q.categoryID);
  }

  public render() {
    const q = this.props.question;

    return (
      <LikertQuestionForm
        edit
        newQuestion={q.question}
        categoryID={q.categoryID}
        description={q.description}
        leftLabel={q.minLabel}
        rightLabel={q.maxLabel}
        leftValue={q.minValue}
        rightValue={q.maxValue}
        submitButtonText="Save changes"
        onSubmitButtonClick={this.editQuestion}
        {...this.props}
      />
    );
  }
}

const EditLikertQuestion = editLikertQuestion<IProps>(EditLikertQuestionInner);
export { EditLikertQuestion };
