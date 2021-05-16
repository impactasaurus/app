import * as React from "react";
import { RadarData } from "models/radar";
import { render } from "./inner";
import Raven from "raven-js";
import "./style.less";

interface IProps {
  data: RadarData;
  opt?: any;
}

export const RadarChartStatic = ({ data, opt }: IProps) => {
  if (data.series.length !== 1) {
    Raven.captureException("Expecting charts of containing one series");
    return <div />;
  }
  const columns: any = data.series[0].datapoints
    .sort((a, b) => {
      return a.axisIndex - b.axisIndex;
    })
    .reduce((m, dp) => {
      m[dp.axis] = dp.axis;
      return m;
    }, {});
  if (Object.keys(columns).length < 3) {
    return <div />;
  }
  const series: any = data.series.map((d) => {
    return d.datapoints.reduce(
      (m, dp) => {
        m[dp.axis] =
          (dp.value - data.scaleMin) / (data.scaleMax - data.scaleMin);
        return m;
      },
      {
        class: d.name,
      }
    );
  });
  return render({
    columns,
    data: series,
    opt,
  });
};
