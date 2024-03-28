import { QuestionnairishType } from "components/QuestionnairesAndSequencesHoC";

export enum AssessmentType {
  live,
  remote,
  historic,
  summon,
}

export interface IAssessmentConfig {
  beneficiaryID: string;
  qishID: string;
  qishType: QuestionnairishType;
  date?: Date;
  tags?: string[];
}

export const defaultRemoteMeetingLimit = 365;
