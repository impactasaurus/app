export interface IGraphDataPoint {
  x: Date;
  y: number;
}

export interface IGraphSeries {
  label: string;
  data: IGraphDataPoint[];
}

export type GraphData = IGraphSeries[];

export function getMaximumNumberOfPointsPerSeries(data: GraphData): number {
  return data.reduce((max, x) => {
    return x.data.length > max ? x.data.length : max;
  }, 0);
}
