import * as moment from 'moment';

export function isBeforeDay(a: moment.Moment, b: moment.Moment) {
  const aYear = a.year();
  const aMonth = a.month();

  const bYear = b.year();
  const bMonth = b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) {
    return a.date() < b.date();
  }
  if (isSameYear) {
    return aMonth < bMonth;
  }
  return aYear < bYear;
}

export function isSameDay(a: moment.Moment, b: moment.Moment) {
  return a.date() === b.date() &&
    a.month() === b.month() &&
    a.year() === b.year();
}

export function isAfterDay(a: moment.Moment, b: moment.Moment) {
  return !isBeforeDay(a, b) && !isSameDay(a, b);
}

export function isInclusivelyBeforeDay(a: moment.Moment, b: moment.Moment) {
  return !isAfterDay(a, b);
}

export function isInclusivelyAfterDay(a: moment.Moment, b: moment.Moment) {
  return !isBeforeDay(a, b);
}

export function getStartOfDay(m: moment.Moment): moment.Moment {
  const c = m.clone();
  c.hour(0);
  c.minute(0);
  c.second(0);
  c.millisecond(0);
  return c;
}

export function getEndOfDay(m: moment.Moment): moment.Moment {
  const c = m.clone();
  c.hour(23);
  c.minute(59);
  c.second(59);
  c.millisecond(999);
  return c;
}
