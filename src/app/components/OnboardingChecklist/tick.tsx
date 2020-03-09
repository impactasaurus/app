import * as React from 'react';
import {Icon} from 'semantic-ui-react';
import './tick.less';

interface IProps {
  complete: boolean;
  loading: boolean;
}

export const Tick = (p: IProps) => {
  const wrapper = (inner: JSX.Element): JSX.Element => <div className="tick-wrapper">{inner} </div>;
  const className = p.complete ? 'complete' : 'incomplete';
  return wrapper((
    <Icon aria-hidden="true" name="check circle" className={className}/>
  ));
};
