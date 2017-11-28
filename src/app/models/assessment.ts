export enum AssessmentType {
  live,
  remote,
  historic,
}

export interface IAssessmentConfig {
  beneficiaryID: string;
  outcomeSetID: string;
  date?: Date;
}
