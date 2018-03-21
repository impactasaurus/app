import * as React from 'react';
import InputMoment from 'input-moment';
import * as moment from 'moment';
import './input-moment.less';
import './overrides.less';

interface IProps {
  moment: moment.Moment;
  onChange: (newDate: moment.Moment) => void;
  allowFutureDates?: boolean;
}

interface IState {
  error?: string;
}

class DateTimePicker extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  private onChange(newDate: moment.Moment): void {
    if (this.props.allowFutureDates === false && newDate > moment()) {
      this.setState({
        error: 'Date must be in the past',
      });
      return;
    }
    this.setState({
      error: undefined,
    });
    this.props.onChange(newDate);
  }

  public render() {
    const copy = this.props.moment.clone();
    return (
      <div>
        <InputMoment className="DateTimePicker" moment={copy} onChange={this.onChange} prevMonthIcon="chevron left icon" nextMonthIcon="chevron right icon" />
        <p>{this.state.error}</p>
      </div>
    );
  }
}

export {DateTimePicker};
