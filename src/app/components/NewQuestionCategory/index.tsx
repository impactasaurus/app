import * as React from 'react';
import {QuestionCategoryForm} from '../QuestionCategoryForm';
import {ICategoryMutation, addQuestionCategory} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
}

class NewQuestionCategoryInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);

    this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
  }

  private onSubmitButtonPress(QuestionSetID: string, name: string, aggregation: string, description: string): Promise<IOutcomeSet> {
    return this.props.addCategory(QuestionSetID, name, aggregation, description);
  }

  public render() {
    return (
      <QuestionCategoryForm
        OnSuccess={this.props.OnSuccess}
        onSubmitButtonPress={this.onSubmitButtonPress}
        QuestionSetID={this.props.QuestionSetID}
        submitButtonText="Add"
      />
    );
  }
}

const NewQuestionCategory = addQuestionCategory<IProps>(NewQuestionCategoryInner);
export { NewQuestionCategory };
