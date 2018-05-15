import * as React from 'react';
import {ILabel} from 'models/question';
import {Likert} from 'components/Likert';

interface IProps {
  labels?: ILabel[];
  leftValue: number;
  rightValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  value?: number;
  delay?: number;
}

class LikertDebounced extends React.Component<IProps, any> {

  private timer;

  constructor(props) {
    super(props);
    this.timer = undefined;
    this.onChange = this.onChange.bind(this);
  }

  private onChange(value: number) {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.props.onChange(value);
    }, this.props.delay || 100);
  }

  public render() {
    return (
      <Likert
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

export { LikertDebounced };
