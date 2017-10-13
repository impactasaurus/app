import * as React from 'react';
import {QuestionCategoryForm} from '../QuestionCategoryForm';
import {ICategoryMutation, editQuestionCategory} from 'apollo/modules/categories';
import {ICategory} from 'models/category';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  category: ICategory;
  OnSuccess: ()=>void;
}

class EditQuestionCategoryInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);

    this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
  }

  private onSubmitButtonPress(QuestionSetID: string, name: string, aggregation: string, description: string): Promise<IOutcomeSet> {
    return this.props.editCategory(QuestionSetID, this.props.category.id, name, aggregation, description);
  }

  public render() {
    return (
      <QuestionCategoryForm
        OnSuccess={this.props.OnSuccess}
        onSubmitButtonPress={this.onSubmitButtonPress}
        QuestionSetID={this.props.QuestionSetID}
        submitButtonText="Save changes"
        name={this.props.category.name}
        description={this.props.category.description}
        aggregation={this.props.category.aggregation}
      />
    );
  }
}

const EditQuestionCategory = editQuestionCategory<IProps>(EditQuestionCategoryInner);
export { EditQuestionCategory };
