import * as React from 'react';
import Slider from 'rc-slider';
import './style.less';

interface IProps {
  leftLabel?: string;
  rightLabel?: string;
  leftValue: number;
  rightValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface IState {
  awaitingAnswer: boolean;
}

class Likert extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      awaitingAnswer: true,
    };
    this.isInverted = this.isInverted.bind(this);
    this.minValue = this.minValue.bind(this);
    this.maxValue = this.maxValue.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
    this.defaultValue = this.defaultValue.bind(this);
    this.touched = this.touched.bind(this);
  }

  private isInverted() {
    return this.props.leftValue > this.props.rightValue;
  }

  private minValue() {
    return this.isInverted() ? this.props.rightValue : this.props.leftValue;
  }

  private maxValue() {
    return this.isInverted() ? this.props.leftValue : this.props.rightValue;
  }

  private defaultValue() {
      return Math.floor((this.maxValue()-this.minValue())/2);
  }

  private touched() {
    if (this.state.awaitingAnswer) {
      this.setAnswer(this.defaultValue());
      this.setState({
        awaitingAnswer: false,
      });
    }
  }

  private setAnswer(value: number) {
    let v = value;
    if (this.isInverted()) {
        const diff = this.maxValue() - this.minValue();
        v = (diff - (value - this.minValue())) + this.minValue();
    }
    this.props.onChange(v);
  }

  public render() {
    const leftValue = this.minValue();
    const rightValue = this.maxValue();
    let marks;
    if (this.props.rightLabel !== null || this.props.leftLabel !== null) {
      marks = {};
      marks[leftValue] = this.props.leftLabel;
      marks[rightValue] = this.props.rightLabel;
    }
    let className = 'likert-scale';
    if (this.state.awaitingAnswer) {
      className = `${className} awaiting-input`;
    }
    return (
      <Slider
        className={className}
        min={leftValue}
        max={rightValue}
        defaultValue={this.defaultValue()}
        marks={marks}
        dots={true}
        onChange={this.setAnswer}
        onBeforeChange={this.touched}
        disabled={this.props.disabled}
      />
    );
  }
}

export { Likert };
