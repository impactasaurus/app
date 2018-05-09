import * as React from 'react';
import {IQuestionMutation, editLikertQuestion} from 'apollo/modules/questions';
import {IOutcomeSet} from 'models/outcomeSet';
import {LikertQuestionForm} from '../LikertQuestionForm/index';
import {ILikertQuestionForm, Question} from 'models/question';
import {ICategoryMutation, setCategory} from '../../apollo/modules/categories';

interface IProps extends IQuestionMutation, ICategoryMutation {
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
    let p = this.props.editLikertQuestion(this.props.QuestionSetID, this.props.question.id, q.question, q.description, q.labels);
    if (q.categoryID !== this.props.question.categoryID) {
      p = p.then(() => {
        return this.props.setCategory(this.props.QuestionSetID, this.props.question.id, q.categoryID);
      });
    }
    return p;
  }

  public render() {
    const q = this.props.question;

    return (
      <LikertQuestionForm
        edit
        newQuestion={q.question}
        categoryID={q.categoryID}
        description={q.description}
        labels={q.labels}
        leftValue={q.leftValue}
        rightValue={q.rightValue}
        submitButtonText="Save changes"
        onSubmitButtonClick={this.editQuestion}
        {...this.props}
      />
    );
  }
}

const EditLikertQuestion = setCategory<IProps>(editLikertQuestion<IProps>(EditLikertQuestionInner));
export { EditLikertQuestion };
