import * as React from 'react';
import { Button, Input, ButtonProps, Select } from 'semantic-ui-react';
import {ICategoryMutation, addQuestionCategory} from 'apollo/modules/categories';

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
      name: null,
      aggregation: null,
    };
    this.addCategory = this.addCategory.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setAggregation = this.setAggregation.bind(this);
  }

  private addCategory() {
    if (typeof this.state.name !== 'string' || this.state.name.length === 0) {
      this.setState({
        error: 'A name must be specified',
      });
      return;
    }
    if (typeof this.state.aggregation !== 'string') {
      this.setState({
        error: 'An aggregation must be selected',
      });
      return;
    }
    this.setState({
      saving: true,
    });
    this.props.addCategory(this.props.QuestionSetID, this.state.name, this.state.aggregation, this.state.description)
    .then(() => {
      this.setState({
        saving: false,
      });
      this.props.OnSuccess();
    })
    .catch((e: Error)=> {
      this.setState({
        error: e.message,
        saving: false,
      });
    });
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

  private getAggregationOptions() {
    return [{
      key: 'mean',
      value: 'mean',
      text: 'Average',
    }, {
      key: 'sum',
      value: 'sum',
      text: 'Sum',
    }];
  }

  public render() {
    const addProps: ButtonProps = {};
    if (this.state.saving) {
      addProps.loading = true;
      addProps.disabled = true;
    }
    return (
      <div>
        <Input type="text" placeholder="Name" onChange={this.setName} />
        <Input type="text" placeholder="Description" onChange={this.setDescription}/>
        <Select placeholder="Aggregation" options={this.getAggregationOptions()} onChange={this.setAggregation} />
        <Button {...addProps} onClick={this.addCategory}>Add</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

const NewQuestionCategory = addQuestionCategory<IProps>(NewQuestionCategoryInner);
export { NewQuestionCategory };
