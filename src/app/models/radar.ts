export interface IRadarPoint {
  axis: string;
  value: number;
  note?: string;
}

export interface IRadarSeries {
  name?: string | Date;
  note?: string;
  datapoints: IRadarPoint[];
  disabled?: boolean;
}

export interface IRadarData {
  series: IRadarSeries[];
  scaleMin: number;
  scaleMax: number;
}

export type RadarData = IRadarData;
