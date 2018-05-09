import * as React from 'react';
import { Message, Input } from 'semantic-ui-react';
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

const noop = () => {};
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

class LikertForm extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.setLeftLabel = this.setLeftLabel.bind(this);
    this.setRightLabel = this.setRightLabel.bind(this);
    this.setLeftValue = this.setLeftValue.bind(this);
    this.setRightValue = this.setRightValue.bind(this);
    this.renderValueInputs = this.renderValueInputs.bind(this);
    this.getLeftLabel = this.getLeftLabel.bind(this);
    this.getRightLabel = this.getRightLabel.bind(this);
  }

  private setLeftLabel(_, data) {
    this.props.onChange({
      labels: addOrEditLabel({
        value: this.props.leftValue,
        label: data.value,
      }, this.props.labels),
      leftValue: this.props.leftValue,
      rightValue: this.props.rightValue,
    });
  }

  private setRightLabel(_, data) {
    this.props.onChange({
      labels: addOrEditLabel({
        value: this.props.rightValue,
        label: data.value,
      }, this.props.labels),
      leftValue: this.props.leftValue,
      rightValue: this.props.rightValue,
    });
  }

  private setLeftValue(_, data) {
    const newV = toInt(data.value);
    if (isNaN(newV)) {
      return;
    }
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
    this.props.onChange({
      // also need to update the right label as it will now have a new value
      labels: replaceLabel(this.props.rightValue, newV, this.getRightLabel(), this.props.labels),
      leftValue: this.props.leftValue,
      rightValue: newV,
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

  private renderValueInputs() {
    const left = (<Input className="left" type="number" placeholder="Left Value" onChange={this.setLeftValue} defaultValue={this.props.leftValue} disabled={this.props.edit} />);
    const right = (<Input className="right" type="number" placeholder="Right Value" onChange={this.setRightValue} defaultValue={this.props.rightValue} disabled={this.props.edit} />);
    let editMsg = (<span />);
    if (this.props.edit) {
      editMsg = (<Message content={strings.valuesNotEditable} info={true}/>);
    }
    return (
      <div>
        {editMsg}
        {left}
        {right}
      </div>
    );
  }

  public render() {
    return (
      <div className="likert-form">
        <div className="section mid">
          <Input className="left" type="text" placeholder="Left Label (optional)" onChange={this.setLeftLabel} value={this.getLeftLabel()} />
          <Input className="right" type="text" placeholder="Right Label (optional)" onChange={this.setRightLabel} value={this.getRightLabel()} />
        </div>
        <div className="section likert">
          <Likert
            leftValue={this.props.leftValue}
            rightValue={this.props.rightValue}
            onChange={noop}
            disabled={true} />
        </div>
        <div className="section lower">
          {this.renderValueInputs()}
        </div>
      </div>
    );
  }
}

export { LikertForm };
