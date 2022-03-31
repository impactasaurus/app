import React from "react";
import moment from "moment";
import cx from "classnames";
import range from "lodash/range";
import chunk from "lodash/chunk";
import { useTranslation } from "react-i18next";

interface IProps {
  moment: moment.Moment;
  onChange: (d: moment.Moment) => void;
}

const Day = (p: {
  dayInMonthIndex: number;
  weekInMonthIndex: number;
  selectedDate: number;
  focussedMonthIndex: number;
  onClick: () => void;
}) => {
  const prevMonth = p.weekInMonthIndex === 0 && p.dayInMonthIndex > 7;
  const nextMonth = p.weekInMonthIndex >= 4 && p.dayInMonthIndex <= 14;
  const cellMonth = prevMonth
    ? p.focussedMonthIndex - 1
    : nextMonth
    ? p.focussedMonthIndex + 1
    : p.focussedMonthIndex;
  const today = moment();
  const cls = cx({
    "prev-month": prevMonth,
    "next-month": nextMonth,
    "selected-day":
      !prevMonth && !nextMonth && p.dayInMonthIndex === p.selectedDate,
    "current-day":
      today.month() === cellMonth && today.date() === p.dayInMonthIndex,
  });
  return (
    <td onClick={p.onClick} className={cls}>
      {p.dayInMonthIndex}
    </td>
  );
};

const leftIcon = "chevron left icon";
const rightIcon = "chevron right icon";

export const Calendar = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const selectDate = (i, w) => {
    const prevMonth = w === 0 && i > 7;
    const nextMonth = w >= 4 && i <= 14;
    const m = p.moment;

    if (prevMonth) m.subtract(1, "month");
    if (nextMonth) m.add(1, "month");

    m.date(i);

    p.onChange(m);
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    p.onChange(p.moment.subtract(1, "month"));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    p.onChange(p.moment.add(1, "month"));
  };

  const m = p.moment;
  const d = m.date();
  const d1 = m.clone().subtract(1, "month").endOf("month").date();
  const d2 = m.clone().date(1).day();
  const d3 = m.clone().endOf("month").date();
  const days = [].concat(
    range(d1 - d2 + 1, d1 + 1),
    range(1, d3 + 1),
    range(1, 42 - d3 - d2 + 1)
  );
  const daysOfTheWeek = [
    t("Sun"),
    t("Mon"),
    t("Tue"),
    t("Wed"),
    t("Thu"),
    t("Fri"),
    t("Sat"),
  ];

  return (
    <div className="m-calendar tab">
      <div className="toolbar">
        <button type="button" className="prev-month" onClick={prevMonth}>
          <i className={leftIcon} />
        </button>
        <span className="current-date">{m.format("MMMM YYYY")}</span>
        <button type="button" className="next-month" onClick={nextMonth}>
          <i className={rightIcon} />
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {daysOfTheWeek.map((w, i) => (
              <td key={i}>{w}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {chunk(days, 7).map((row, w) => (
            <tr key={w}>
              {row.map((i) => (
                <Day
                  key={i}
                  dayInMonthIndex={i}
                  selectedDate={d}
                  weekInMonthIndex={w}
                  focussedMonthIndex={m.month()}
                  onClick={() => selectDate(i, w)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
