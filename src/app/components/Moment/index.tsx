import React from "react";
import { IStore } from "redux/IStore";
import { connect } from "react-redux";
import { getHumanisedDate, getHumanisedTimeSinceDate } from "helpers/moment";
import { LOCALE_PREF_KEY } from "components/Localiser";

const stateToProps = (state: IStore) => {
  return {
    locale: state.pref[LOCALE_PREF_KEY],
  };
};

interface ILocaleProps {
  locale: string;
}

interface IDateProps extends ILocaleProps {
  date: Date;
}

interface IIsoProps {
  iso: string;
}

export const DateString = connect(stateToProps)(
  (p: IDateProps): JSX.Element => (
    <span>{getHumanisedDate(p.date, p.locale)}</span>
  )
);
export const ISODateString = (p: IIsoProps): JSX.Element => (
  <DateString date={new Date(p.iso)} />
);

export const TimeSince = connect(stateToProps)(
  (p: IDateProps): JSX.Element => (
    <span>{getHumanisedTimeSinceDate(p.date, p.locale)}</span>
  )
);
export const ISOTimeSince = (p: IIsoProps): JSX.Element => (
  <TimeSince date={new Date(p.iso)} />
);
