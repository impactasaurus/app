import * as React from 'react';
import {Message, Input, Label, InputProps, Form} from 'semantic-ui-react';
import { Likert } from 'components/Likert';
import './style.less';
import {ILabel, ILikertForm} from 'models/question';
import {isNullOrUndefined} from 'util';
const strings = require('./../../../strings.json');

interface IProps  {
  onChange(likert: ILikertForm);
  edit: boolean;
  labels: ILabel[];
  leftValue: number;
  rightValue: number;
}

interface IState {
  selectedLabel?: number;
}

const toInt = (s: string) => parseInt(s, 10);
const addOrEditLabel = (l: ILabel, ls: ILabel[]): ILabel[] => {
  const base = ls.concat().filter((x) => x.value !== l.value);
  if (!isNullOrUndefined(l.label) && l.label.length > 0) {
    base.push(l);
  }
  return base;
};
const replaceLabel = (oldVal: number, newVal: number, label: string, labels: ILabel[]): ILabel[] => {
  const removedOldLabel = addOrEditLabel({
    label: undefined,
    value: oldVal,
  }, labels);
  return addOrEditLabel({
    label,
    value: newVal,
  }, removedOldLabel);
};

class LikertForm extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.setLabelBeingEdited = this.setLabelBeingEdited.bind(this);
    this.setLeftValue = this.setLeftValue.bind(this);
    this.setRightValue = this.setRightValue.bind(this);
    this.renderValueInputs = this.renderValueInputs.bind(this);
    this.setLabel = this.setLabel.bind(this);
    this.getLeftLabel = this.getLeftLabel.bind(this);
    this.getRightLabel = this.getRightLabel.bind(this);
    this.renderLabelControl = this.renderLabelControl.bind(this);
  }

  private setLabelBeingEdited(val: number) {
    this.setState({
      selectedLabel: val,
    });
  }

  private getLeftLabel(): string {
    const l = this.props.labels.find((l) => l.value === this.props.leftValue);
    return (l === undefined) ? undefined : l.label;
  }

  private getRightLabel(): string {
    const l = this.props.labels.find((l) => l.value === this.props.rightValue);
    return (l === undefined) ? undefined : l.label;
  }

  private setLeftValue(_, data) {
    const newV = toInt(data.value);
    if (isNaN(newV)) {
      return;
    }
    this.setState({
      selectedLabel: undefined,
    });
    this.props.onChange({
      // also need to update the left label as it will now have a new value
      labels: replaceLabel(this.props.leftValue, newV, this.getLeftLabel(), this.props.labels),
      leftValue: newV,
      rightValue: this.props.rightValue,
    });
  }

  private setRightValue(_, data) {
    const newV = toInt(data.value);
    if (isNaN(newV)) {
      return;
    }
    this.setState({
      selectedLabel: undefined,
    });
    this.props.onChange({
      // also need to update the right label as it will now have a new value
      labels: replaceLabel(this.props.rightValue, newV, this.getRightLabel(), this.props.labels),
      leftValue: this.props.leftValue,
      rightValue: newV,
    });
  }

  private setLabel(_, data) {
    this.props.onChange({
      labels: addOrEditLabel({
        value: this.state.selectedLabel,
        label: data.value,
      }, this.props.labels),
      leftValue: this.props.leftValue,
      rightValue: this.props.rightValue,
    });
  }

  private renderLabelControl(): JSX.Element {
    const props: InputProps = {};
    let message = (<span />);
    if (this.state.selectedLabel === undefined) {
      props.disabled = true;
      message = (<Label basic pointing="left">Click a point on the scale to set or edit labels</Label>);
    }
    const editedLabel = this.props.labels.find((l) => l.value === this.state.selectedLabel);
    return (
      <div key={this.state.selectedLabel}>
        <Input {...props} icon="tag" iconPosition="left" placeholder="Label for highlighted point" onChange={this.setLabel} defaultValue={editedLabel ? editedLabel.label : undefined} />
        {message}
      </div>
    );
  }

  private renderValueInputs(): JSX.Element {
    if (this.props.edit) {
      return (<Message content={strings.valuesNotEditable} info={true}/>);
    }
    return (
      <Form>
        <Form.Group>
          <Form.Input required label="Left Value" type="number" placeholder="Left Value" width={4} onChange={this.setLeftValue} defaultValue={this.props.leftValue} />
          <Form.Input className="padding" width={8} />
          <Form.Input required label="Right Value" type="number" placeholder="Right Value" width={4} onChange={this.setRightValue} defaultValue={this.props.rightValue} />
        </Form.Group>
      </Form>
    );
  }

  public render() {
    return (
      <div className="likert-form">
        <div className="section mid">
          {this.renderValueInputs()}
        </div>
        <div className="section likert">
          <Likert
            key={`${this.props.leftValue}-${this.props.rightValue}`}
            leftValue={this.props.leftValue}
            rightValue={this.props.rightValue}
            onChange={this.setLabelBeingEdited}
            disabled={false}
            value={this.state.selectedLabel}
            labels={this.props.labels}
          />
        </div>
        <div className="section lower">
          {this.renderLabelControl()}
        </div>
      </div>
    );
  }
}

export { LikertForm };
