export interface IBarChartSeries {
  data: number[];
  label: string;
}

export interface IBarChartData {
  labels: string[];
  series: IBarChartSeries[];
}

export type BarChartData = IBarChartData;
