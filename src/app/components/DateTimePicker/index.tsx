import React, { useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { InputMoment } from "./input-moment";
import "./input-moment.less";
import "./overrides.less";

interface IProps {
  moment: moment.Moment;
  onChange: (newDate: moment.Moment) => void;
  allowFutureDates?: boolean;
  id?: string;
}

const DateTimePicker = (p: IProps): JSX.Element => {
  const [error, setError] = useState<string>(undefined);
  const { t } = useTranslation();

  const onChange = (newDate: moment.Moment): void => {
    if (p.allowFutureDates === false && newDate > moment()) {
      setError(t("Date must be in the past"));
      return;
    }
    setError(undefined);
    p.onChange(newDate);
  };

  const copy = p.moment.clone();
  return (
    <div>
      <InputMoment
        className="DateTimePicker"
        moment={copy}
        onChange={onChange}
        id={p.id}
      />
      <p>{error}</p>
    </div>
  );
};

export { DateTimePicker };
