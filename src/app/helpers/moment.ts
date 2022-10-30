import moment from "moment";

export enum DateFormats {
  LONG = "llll",
  MID = "MMMM Do YYYY",
  SHORT = "MMM Do YYYY",
}

export function isBeforeDay(a: moment.Moment, b: moment.Moment): boolean {
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

export function isSameDay(a: moment.Moment, b: moment.Moment): boolean {
  return (
    a.date() === b.date() && a.month() === b.month() && a.year() === b.year()
  );
}

export function isAfterDay(a: moment.Moment, b: moment.Moment): boolean {
  return !isBeforeDay(a, b) && !isSameDay(a, b);
}

export function isInclusivelyBeforeDay(
  a: moment.Moment,
  b: moment.Moment
): boolean {
  return !isAfterDay(a, b);
}

export function isInclusivelyAfterDay(
  a: moment.Moment,
  b: moment.Moment
): boolean {
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

export function getHumanisedTimeSinceDate(d: Date, locale?: string): string {
  const m = moment(d);
  const diff = m.diff(moment());
  let duration = moment.duration(diff);
  if (locale) {
    duration = duration.locale(locale);
  }
  return duration.humanize(true);
}

export function getHumanisedDate(
  d: Date,
  f = DateFormats.MID,
  locale?: string
): string {
  let m = moment(d);
  if (locale) {
    m = m.locale(locale);
  }
  return m.format(f);
}

export function getHumanisedDateFromISO(
  s: string,
  f = DateFormats.MID,
  locale?: string
): string {
  return getHumanisedDate(new Date(s), f, locale);
}
