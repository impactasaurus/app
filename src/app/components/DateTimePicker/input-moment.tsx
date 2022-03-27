import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "./calendar";
import { Time } from "./time";

interface IProps {
  moment: moment.Moment;
  onChange: (d: moment.Moment) => void;
  id?: string;
  className?: string;
}

enum Tab {
  CALENDAR,
  TIME,
}

export const InputMoment = (p: IProps): JSX.Element => {
  const [tab, setTab] = useState<Tab>(Tab.CALENDAR);
  const { t } = useTranslation();

  const handleClickTab = (e: React.MouseEvent, tab: Tab) => {
    e.preventDefault();
    setTab(tab);
  };

  return (
    <div className={`m-input-moment ${p.className}`}>
      <div className="options">
        <button
          type="button"
          className={`ion-calendar im-btn ${
            tab === Tab.CALENDAR ? "is-active" : ""
          }`}
          onClick={(e) => handleClickTab(e, Tab.CALENDAR)}
        >
          {t("Date")}
        </button>
        <button
          type="button"
          className={`ion-clock im-btn ${tab === Tab.TIME ? "is-active" : ""}`}
          onClick={(e) => handleClickTab(e, Tab.TIME)}
        >
          {t("Time")}
        </button>
      </div>

      <div className="tabs">
        {tab === Tab.CALENDAR && (
          <Calendar moment={p.moment} onChange={p.onChange} />
        )}
        {tab === Tab.TIME && (
          <Time
            moment={p.moment}
            onChange={p.onChange}
            minStep={1}
            hourStep={1}
          />
        )}
      </div>
    </div>
  );
};
