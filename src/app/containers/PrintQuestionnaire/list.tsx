import * as React from 'react';
import {ILikertScale} from 'models/question';

interface IProps {
  questions: ILikertScale[];
}

export const List = (p: IProps) => (
  <div>list {p.questions.length}</div>
);
