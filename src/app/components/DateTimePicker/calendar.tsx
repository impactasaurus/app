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

const Day = (p: { i: number; w: number; d: number; onClick: () => void }) => {
  const prevMonth = p.w === 0 && p.i > 7;
  const nextMonth = p.w >= 4 && p.i <= 14;
  const cls = cx({
    "prev-month": prevMonth,
    "next-month": nextMonth,
    "current-day": !prevMonth && !nextMonth && p.i === p.d,
  });

  return (
    <td onClick={p.onClick} className={cls}>
      {p.i}
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
  const weeks = [
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
            {weeks.map((w, i) => (
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
                  i={i}
                  d={d}
                  w={w}
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
