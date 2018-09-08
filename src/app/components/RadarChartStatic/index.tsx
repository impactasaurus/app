import {RadarData} from 'models/radar';
import {render} from './inner';

interface IProps {
  data: RadarData;
  opt?: any;
}

export const RadarChartStatic = ({data, opt}: IProps) => {
  const columns: any = data.series[0].datapoints.reduce((m, dp) => {
    m[dp.axis] = dp.axis;
    return m;
  }, {});
  const series: any = data.series.map((d) => {
    return d.datapoints.reduce((m, dp) => {
      m[dp.axis] = (dp.value-data.scaleMin) / data.scaleMax;
      return m;
    }, {
      class: d.name,
    });
  });
  return render({
    columns,
    data: series,
    opt,
  });
};
