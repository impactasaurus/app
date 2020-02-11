export interface IRadarPoint {
  axis: string;
  // axisIndex provides order information for the radar chart's axis.
  // The axis are sorted by the axisIndex, ensuring radar charts are comparable and consistent
  axisIndex: number;
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
