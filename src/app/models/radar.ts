export interface IRadarPoint {
  axis: string;
  value: number;
  note?: string;
}

export interface IRadarSeries {
  name?: string | Date;
  note?: string;
  datapoints: IRadarPoint[];
}

export type RadarData = IRadarSeries[];
