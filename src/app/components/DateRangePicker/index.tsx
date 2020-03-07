import * as React from 'react';
import {startOfDay, endOfDay, subYears} from 'date-fns';
import {DateRangePicker as ReactDateRangePicker} from 'react-date-range';
import './styles.scss';

interface IProp {
  future?: boolean;
  onSelect?: (start: Date, end: Date) => void;
  onSelectUnfiltered?: (start: Date|null, end: Date|null) => void;
}

interface IState {
  start?: Date;
  end?: Date;
}

class DateRangePicker extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onDateChangeDRP = this.onDateChangeDRP.bind(this);
  }

  public componentDidMount() {
    if (this.state.start === null && this.state.end === null) {
      this.onDateChange(subYears(new Date(), 1), new Date());
    }
  }

  private onDateChange(startDate: Date|null, endDate: Date|null) {
    this.setState({
      start: startDate,
      end: endDate,
    });
    const s = startDate ? startOfDay(startDate) : null;
    const e = endDate ? endOfDay(endDate) : null;
    if (this.props.onSelectUnfiltered !== undefined) {
      this.props.onSelectUnfiltered(s, e);
    }
    if (s !== null && e !== null && this.props.onSelect !== undefined) {
      this.props.onSelect(s, e);
    }
  }

  private onDateChangeDRP({selection: {startDate, endDate}}: {selection: {startDate: Date|null, endDate: Date|null}}) {
    this.onDateChange(startDate, endDate);
  }

  public render() {
    const selectionRange = {
      startDate: this.state.start,
      endDate: this.state.end,
      key: 'selection',
    };
    return (
      <ReactDateRangePicker
        ranges={[selectionRange]}
        onChange={this.onDateChangeDRP}
        weekStartsOn={1}
        rangeColors={['#935D8C']}
        staticRanges={[]}
        inputRanges={[]}
        startDatePlaceholder={'Start'}
        endDatePlaceholder={'End'}
        minDate={new Date('2000-01-01T00:00:00Z')}
        maxDate={this.props.future ? undefined : new Date()}
        dateDisplayFormat="do MMM yyyy"
        editableDateInputs={true}
        moveRangeOnFirstSelection={true}
      />
    );
  }
}

export {DateRangePicker};
