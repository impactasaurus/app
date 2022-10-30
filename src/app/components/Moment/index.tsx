import React from "react";
import { IStore } from "redux/IStore";
import { connect } from "react-redux";
import {
  DateFormats,
  getHumanisedDate,
  getHumanisedTimeSinceDate,
} from "helpers/moment";
import { LOCALE_PREF_KEY } from "components/Localiser";

const stateToProps = (state: IStore) => {
  return {
    locale: state.pref[LOCALE_PREF_KEY],
  };
};

interface ILocaleProps {
  locale: string;
}

export const DateString = connect(stateToProps)(
  (
    p: {
      date: Date;
      format?: DateFormats;
    } & ILocaleProps
  ): JSX.Element => <span>{getHumanisedDate(p.date, p.format, p.locale)}</span>
);
export const ISODateString = (p: {
  iso: string;
  format?: DateFormats;
}): JSX.Element => <DateString date={new Date(p.iso)} format={p.format} />;

export const TimeSince = connect(stateToProps)(
  (
    p: {
      date: Date;
    } & ILocaleProps
  ): JSX.Element => <span>{getHumanisedTimeSinceDate(p.date, p.locale)}</span>
);
export const ISOTimeSince = (p: { iso: string }): JSX.Element => (
  <TimeSince date={new Date(p.iso)} />
);
