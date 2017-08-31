import * as React from 'react';
import {DateRangePicker as DRPicker} from 'react-dates';
import {isInclusivelyBeforeDay, getStartOfDay, getEndOfDay} from 'helpers/moment';
import './styles.scss';
import * as moment from 'moment';

interface IProp {
  future?: boolean;
  onSelect: (start: Date, end: Date) => void;
}

interface IState {
  focusedInput?: string;
  start?: moment.Moment;
  end?: moment.Moment;
}

class DateRangePicker extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      start: null,
      end: null,
    };
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.isDateDisabled = this.isDateDisabled.bind(this);
  }

  private onFocusChange(focusedInput: string) {
    this.setState({
      focusedInput,
    });
  }

  private onDateChange({startDate, endDate}: {startDate: moment.Moment|null, endDate: moment.Moment|null}) {
    this.setState({
      start: startDate,
      end: endDate,
    });
    if (startDate !== null && endDate !== null) {
      this.props.onSelect(getStartOfDay(startDate.local()).toDate(), getEndOfDay(endDate.local()).toDate());
    }
  }

  private isDateDisabled(day: moment.Moment): boolean {
    if (this.props.future === false && !isInclusivelyBeforeDay(day, moment())) {
      return true;
    }
    return false;
  }

  public render() {
    return (
      <DRPicker
        startDate={this.state.start}
        endDate={this.state.end}
        onDatesChange={this.onDateChange}
        focusedInput={this.state.focusedInput}
        onFocusChange={this.onFocusChange}
        isOutsideRange={this.isDateDisabled}
        hideKeyboardShortcutsPanel={true}
        numberOfMonths={1}
        displayFormat="Do MMM YYYY"
      />
    );
  }
}

export {DateRangePicker};
