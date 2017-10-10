import * as React from 'react';
import { Button, ButtonProps, Select } from 'semantic-ui-react';
import {Input} from 'components/Input';
import {ICategoryMutation} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProps extends ICategoryMutation {
  OnSuccess: ()=>void;
  onSubmitButtonPress: ()=>Promise<IOutcomeSet>;
  setName: (_, data)=>void;
  setDescription: (_, data)=>void;
  setAggregation: (_, data)=>void;
  submitButtonText: string;
  name?: string;
  description?: string;
  aggregation?: string;
}

interface IState {
  error?: string;
  saving?: boolean;
}

class QuestionCategoryForm extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
  }

  private onSubmitButtonClick() {
    if (typeof this.props.name !== 'string' || this.props.name.length === 0) {
      this.setState({
        error: 'A name must be specified',
      });
      return;
    }
    if (typeof this.props.aggregation !== 'string') {
      this.setState({
        error: 'An aggregation must be selected',
      });
      return;
    }
    this.setState({
      saving: true,
    });

    this.props.onSubmitButtonPress()
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
        <Input autofocus type="text" placeholder="Name" onChange={this.props.setName} value={this.props.name} />
        <Input type="text" placeholder="Description" onChange={this.props.setDescription} value={this.props.description} />
        <Select placeholder="Aggregation" options={this.getAggregationOptions()} value={this.props.aggregation} onChange={this.props.setAggregation} />
        <Button {...submitProps} onClick={this.onSubmitButtonClick}>{this.props.submitButtonText}</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

export { QuestionCategoryForm };
