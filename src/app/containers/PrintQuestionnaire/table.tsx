import * as React from 'react';
import {ILikertScale} from 'models/question';

interface IProps {
  questions: ILikertScale[];
}

export const Table = (p: IProps) => (
  <div>table {p.questions.length}</div>
);
