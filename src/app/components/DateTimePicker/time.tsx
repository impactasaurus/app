import React from "react";
import { useTranslation } from "react-i18next";
import InputSlider from "react-input-slider";

interface IProps {
  moment: moment.Moment;
  onChange: (d: moment.Moment) => void;
  minStep: number;
  hourStep: number;
}

export const Time = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const changeHours = (pos) => {
    const m = p.moment;
    m.hours(pos.x);
    p.onChange(m);
  };

  const changeMinutes = (pos) => {
    const m = p.moment;
    m.minutes(pos.x);
    p.onChange(m);
  };

  return (
    <div className="m-time tab">
      <div className="showtime">
        <span className="time">{p.moment.format("HH")}</span>
        <span className="separater">:</span>
        <span className="time">{p.moment.format("mm")}</span>
      </div>

      <div className="sliders">
        <div className="time-text">{t("Hours")}:</div>
        <InputSlider
          xmin={0}
          xmax={23}
          xstep={p.hourStep}
          x={p.moment.hour()}
          onChange={changeHours}
        />
        <div className="time-text">{t("Minutes")}:</div>
        <InputSlider
          xmin={0}
          xmax={59}
          xstep={p.minStep}
          x={p.moment.minute()}
          onChange={changeMinutes}
        />
      </div>
    </div>
  );
};
