import * as React from 'react';
import {IOutcomeSet} from 'models/outcomeSet';
import {LikertQuestionForm} from 'components/LikertQuestionForm';
import {ILikertForm, ILikertQuestionForm} from 'models/question';
import {IQuestionMutation, addLikertQuestion} from 'apollo/modules/questions';

interface IProps extends IQuestionMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  OnCancel: ()=>void;
  Defaults?: ILikertForm;
}

class NewLikertQuestionInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.addQuestion = this.addQuestion.bind(this);
  }

  private addQuestion(q: ILikertQuestionForm): Promise<IOutcomeSet> {
    return this.props.addLikertQuestion(this.props.QuestionSetID, q.question, q.leftValue, q.rightValue, q.description, q.categoryID, q.labels);
  }

  public render() {
    const defaults: ILikertForm = this.props.Defaults || {};
    return (
      <LikertQuestionForm
        onSubmitButtonClick={this.addQuestion}
        submitButtonText="Add"
        onCancel={this.props.OnCancel}
        labels={defaults.labels}
        leftValue={defaults.leftValue}
        rightValue={defaults.rightValue}
        {...this.props}
      />
    );
  }
}

const NewLikertQuestion = addLikertQuestion<IProps>(NewLikertQuestionInner);

export { NewLikertQuestion };
