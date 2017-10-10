import * as React from 'react';
import {QuestionCategoryForm} from '../QuestionCategoryForm';
import {ICategoryMutation, editQuestionCategory} from 'apollo/modules/categories';
import {ICategory} from 'models/category';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  CategoryID: string;
  category: ICategory;
  OnSuccess: ()=>void;
}

interface IState {
  error?: string;
  name?: string;
  description?: string;
  aggregation?: string;
  saving?: boolean;
}

class EditQuestionCategoryInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);

    const { category } = this.props;
    this.state = {
      saving: false,
      name: category.name || '',
      description: category.description || '',
      aggregation: category.aggregation || null,
    };

    this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setAggregation = this.setAggregation.bind(this);
  }

  private onSubmitButtonPress(): Promise<IOutcomeSet> {
    return this.props.editCategory(this.props.QuestionSetID, this.props.CategoryID, this.state.name, this.state.aggregation, this.state.description);
  }

  private setName(_, data) {
    this.setState({
      name: data.value,
    });
  }

  private setDescription(_, data) {
    this.setState({
      description: data.value,
    });
  }

  private setAggregation(_, data) {
    this.setState({
      aggregation: data.value,
    });
  }

  public render() {

    return (
      <QuestionCategoryForm
        OnSuccess={this.props.OnSuccess}
        onSubmitButtonPress={this.onSubmitButtonPress}
        setName={this.setName}
        setDescription={this.setDescription}
        setAggregation={this.setAggregation}
        submitButtonText="Save changes"
        name={this.state.name}
        description={this.state.description}
        aggregation={this.state.aggregation}
      />
    );
  }
}

const EditQuestionCategory = editQuestionCategory<IProps>(EditQuestionCategoryInner);
export { EditQuestionCategory };
