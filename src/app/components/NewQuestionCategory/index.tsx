import * as React from 'react';
import {QuestionCategoryForm} from '../QuestionCategoryForm';
import {ICategoryMutation, addQuestionCategory} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
}

interface IState {
  error?: string;
  name?: string;
  description?: string;
  aggregation?: string;
  saving?: boolean;
}

class NewQuestionCategoryInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      name: '',
      description: '',
      aggregation: null,
    };
    this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setAggregation = this.setAggregation.bind(this);
  }

  private onSubmitButtonPress(): Promise<IOutcomeSet> {
    return this.props.addCategory(this.props.QuestionSetID, this.state.name, this.state.aggregation, this.state.description);
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
        submitButtonText="Add"
        name={this.state.name}
        description={this.state.description}
        aggregation={this.state.aggregation}
      />
    );
  }
}

const NewQuestionCategory = addQuestionCategory<IProps>(NewQuestionCategoryInner);
export { NewQuestionCategory };
