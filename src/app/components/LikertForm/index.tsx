import * as React from 'react';
import { Message, Input } from 'semantic-ui-react';
import { Likert } from 'components/Likert';
import './style.less';
import {ILabel, ILikertForm} from 'models/question';
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
  base.push(l);
  return base;
};

class LikertForm extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    console.log(props);
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
    this.props.onChange({
      labels: this.props.labels,
      leftValue: toInt(data.value),
      rightValue: this.props.rightValue,
    });
  }

  private setRightValue(_, data) {
    this.props.onChange({
      labels: this.props.labels,
      leftValue: this.props.leftValue,
      rightValue: toInt(data.value),
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
