import * as React from 'react';
import InputMoment from 'input-moment';
import * as moment from 'moment';
import './input-moment.less';
import './overrides.less';

interface IProps {
  moment: moment.Moment;
  onChange: (newDate: moment.Moment) => void;
}

class DateTimePicker extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <InputMoment className="DateTimePicker" moment={this.props.moment} onChange={this.props.onChange} prevMonthIcon="chevron left icon" nextMonthIcon="chevron right icon" />
    );
  }
}

export {DateTimePicker};
