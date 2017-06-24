import {IQuestion} from './question';

export interface IOutcomeSet {
  id: string;
  organisationID: string;
  name: string;
  description: string;
  questions: IQuestion[];
}
