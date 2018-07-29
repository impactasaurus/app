import * as React from 'react';
import {QuestionCategoryForm} from '../QuestionCategoryForm';
import {ICategoryMutation, editQuestionCategory} from 'apollo/modules/categories';
import {ICategory} from 'models/category';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  category: ICategory;
  OnSuccess: ()=>void;
  OnCancel: ()=>void;
}

class EditQuestionCategoryInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
  }

  private onSubmitButtonPress(name: string, aggregation: string, description: string): Promise<IOutcomeSet> {
    return this.props.editCategory(this.props.QuestionSetID, this.props.category.id, name, aggregation, description);
  }

  public render() {
    return (
      <QuestionCategoryForm
        OnSuccess={this.props.OnSuccess}
        OnCancel={this.props.OnCancel}
        onSubmitButtonPress={this.onSubmitButtonPress}
        submitButtonText="Save changes"
        values={{
          name: this.props.category.name,
          description: this.props.category.description,
          aggregation: this.props.category.aggregation,
        }}
      />
    );
  }
}

const EditQuestionCategory = editQuestionCategory<IProps>(EditQuestionCategoryInner);
export { EditQuestionCategory };
