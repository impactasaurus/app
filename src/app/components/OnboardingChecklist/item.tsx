import * as React from 'react';
import {Tick} from './tick';
import { Link } from 'react-router-dom';
import './item.less';

interface IProps {
  title: string;
  description: string;
  completed: boolean;
  loading: boolean;
  link: string;
  index: number;
}

export const OnboardingChecklistItem = (p: IProps) => {
  const classname = `onboarding-checklist-item ${p.completed === true ? 'complete' : 'incomplete'}`;
  return (
    <div className={classname}>
      <Tick complete={p.completed} loading={p.loading} index={p.index} />
      <div className="content">
        <h3 className="title"><Link to={p.link}>{p.title}</Link></h3>
        <p className="description">{p.description}</p>
      </div>
    </div>
  );
};
