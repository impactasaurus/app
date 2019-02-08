export enum AssessmentType {
  live,
  remote,
  historic,
  summon,
}

export interface IAssessmentConfig {
  beneficiaryID: string;
  outcomeSetID: string;
  date?: Date;
  tags?: string[];
}

export const defaultRemoteMeetingLimit = 30;
