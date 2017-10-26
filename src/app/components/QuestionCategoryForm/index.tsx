import * as React from 'react';
import { Button, ButtonProps, Select } from 'semantic-ui-react';
import {Input} from 'components/Input';
import {ICategoryMutation} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  OnSuccess: ()=>void;
  onSubmitButtonPress: (QuestionSetID: string, name: string, aggregation: string, description: string)=>Promise<IOutcomeSet>;
  submitButtonText: string;
  QuestionSetID: string;
  name?: string;
  description?: string;
  aggregation?: string;
}

interface IState {
  error?: string;
  saving?: boolean;
  name?: string;
  description?: string;
  aggregation?: string;
}

class QuestionCategoryForm extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      name: this.props.name || '',
      description: this.props.description || '',
      aggregation: this.props.aggregation || 'mean',
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setAggregation = this.setAggregation.bind(this);
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

  private onSubmitButtonClick() {
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

    this.props.onSubmitButtonPress(this.props.QuestionSetID, this.state.name, this.state.aggregation, this.state.description)
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
    const submitProps: ButtonProps = {};
    if (this.state.saving) {
      submitProps.loading = true;
      submitProps.disabled = true;
    }
    return (
      <div>
        <Input autoFocus type="text" placeholder="Name" onChange={this.setName} value={this.state.name} />
        <Input type="text" placeholder="Description" onChange={this.setDescription} value={this.state.description} />
        <Select placeholder="Aggregation" options={this.getAggregationOptions()} value={this.state.aggregation} onChange={this.setAggregation} />
        <Button {...submitProps} onClick={this.onSubmitButtonClick}>{this.props.submitButtonText}</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

export { QuestionCategoryForm };
