import * as React from 'react';
import Slider from 'rc-slider';
import './style.less';
import {ILabel} from 'models/question';

interface IProps {
  labels?: ILabel[];
  leftValue: number;
  rightValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  value?: number;
}

interface IState {
  awaitingAnswer: boolean;
}

class Likert extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      awaitingAnswer: this.props.value === undefined,
    };
    this.isInverted = this.isInverted.bind(this);
    this.minValue = this.minValue.bind(this);
    this.maxValue = this.maxValue.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
    this.touched = this.touched.bind(this);
    this.invertValue = this.invertValue.bind(this);
  }

  public componentWillReceiveProps(nextProps) {
    if (this.props.value === undefined && nextProps.value !== undefined && this.state.awaitingAnswer) {
      this.setState({
        awaitingAnswer: false,
      });
    }
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

  private touched(value) {
    if (this.props.value === undefined) {
      // This is here because the Slider is set up with a defaultValue.
      // If we are awaiting an answer and the user clicks the default value,
      // the Slider will not raise an on change event.
      // For other value presses this will be called before on change.
      this.setAnswer(value);
    }
  }

  private invertValue(value: number) {
    if (this.isInverted() === false || value === undefined) {
      return value;
    }
    const diff = this.maxValue() - this.minValue();
    return (diff - (value - this.minValue())) + this.minValue();
  }

  private setAnswer(value: number) {
    this.props.onChange(this.invertValue(value));
  }

  private getMarks(p: IProps) {
    const marks = {};
    (p.labels || []).forEach((l: ILabel) => {
      const value = this.invertValue(l.value);
      if (value < this.minValue() || value > this.maxValue()) {
        return;
      }
      marks[value] = l.label;
    });
    return marks;
  }

  public render() {
    const leftValue = this.minValue();
    const rightValue = this.maxValue();

    let className = 'likert-scale';
    if (this.state.awaitingAnswer) {
      className = `${className} awaiting-input`;
    }
    return (
      <Slider
        className={className}
        min={leftValue}
        max={rightValue}
        marks={this.getMarks(this.props)}
        dots={true}
        onChange={this.setAnswer}
        onBeforeChange={this.touched}
        disabled={this.props.disabled}
        value={this.invertValue(this.props.value)}
      />
    );
  }
}

export { Likert };
