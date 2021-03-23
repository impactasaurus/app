import React, {useState, useEffect} from 'react';
import {startOfDay, endOfDay, subYears} from 'date-fns';
import {DateRangePicker as ReactDateRangePicker} from 'react-date-range';
import { useTranslation } from 'react-i18next';
import './styles.less';

interface IProp {
  future?: boolean;
  onSelect?: (start: Date, end: Date) => void;
  onSelectUnfiltered?: (start: Date|null, end: Date|null) => void;
}

const DateRangePicker = (p: IProp): JSX.Element => {
  const [start, setStart] = useState<Date>(null);
  const [end, setEnd] = useState<Date>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (start === null && end === null) {
      onDateChange(subYears(new Date(), 1), new Date());
    }
  }, []);


  const onDateChange = (startDate: Date|null, endDate: Date|null) => {
    const currentlyNull = start === null && end === null;
    const bothChanging = startDate !== start && endDate !== end;
    const bothEqual = startDate && endDate && startDate.getTime() === endDate.getTime();
    if (bothChanging && bothEqual && !currentlyNull) {
      const newStartBeforeCurrentEnd = startDate.getTime() < end.getTime();
      if (newStartBeforeCurrentEnd) {
        endDate = end;
      }
    }
    if (startDate && startDate.getTime() > Date.now()) {
      startDate = new Date();
    }
    if (endDate && endDate.getTime() > Date.now()) {
      endDate = new Date();
    }
    setStart(startDate);
    setEnd(endDate);
    const s = startDate ? startOfDay(startDate) : null;
    const e = endDate ? endOfDay(endDate) : null;
    if (p.onSelectUnfiltered !== undefined) {
      p.onSelectUnfiltered(s, e);
    }
    if (s !== null && e !== null && p.onSelect !== undefined) {
      p.onSelect(s, e);
    }
  }

  const onDateChangeDRP = ({selection: {startDate, endDate}}: {selection: {startDate: Date|null, endDate: Date|null}}) => {
    onDateChange(startDate, endDate);
  }

  const selectionRange = {
    startDate: start,
    endDate: end,
    key: 'selection',
  };
  const format = "d MMM yyyy";
  return (
    <ReactDateRangePicker
      ranges={[selectionRange]}
      onChange={onDateChangeDRP}
      weekStartsOn={1}
      rangeColors={['var(--brand-color-light)']}
      staticRanges={[]}
      inputRanges={[]}
      startDatePlaceholder={t('Start')}
      endDatePlaceholder={t('End')}
      minDate={new Date('2000-01-01T00:00:00Z')}
      maxDate={p.future ? undefined : new Date()}
      dateDisplayFormat={format}
      editableDateInputs={true}
    />
  );
}

export {DateRangePicker};
