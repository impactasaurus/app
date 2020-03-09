import * as React from 'react';
import {Icon} from 'semantic-ui-react';
import './tick.less';

interface IProps {
  complete: boolean;
  loading: boolean;
  index: number;
}

export const Tick = (p: IProps) => {
  const wrapper = (inner: JSX.Element): JSX.Element => <div className="tick-wrapper">{inner} </div>;
  if (!p.complete) {
    return wrapper((
      <Icon.Group>
        <Icon name="circle" />
        <strong className="icon text">{`${p.index}`}</strong>
      </Icon.Group>
    ));
  }
  return wrapper((
    <Icon name="check circle" className="complete" />
  ));
};
