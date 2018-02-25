export interface IGraphDataPoint {
  x: Date;
  y: number;
}

export interface IGraphSeries {
  label: string;
  data: IGraphDataPoint[];
}

export interface IGraphData {
  series: IGraphSeries[];
  scaleMin: number;
  scaleMax: number;
}

export type GraphData = IGraphData;

export function getMaximumNumberOfPointsPerSeries(data: GraphData): number {
  return data.series.reduce((max, x) => {
    return x.data.length > max ? x.data.length : max;
  }, 0);
}
