export interface IRadarPoint {
  axis: string;
  value: number;
  note?: string;
}

export interface IRadarSeries {
  timestamp: Date;
  note?: string;
  datapoints: IRadarPoint[];
}

export type RadarData = IRadarSeries[];
