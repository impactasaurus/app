import * as React from 'react';
import './tick.less';

interface IProps {
  complete: boolean;
  loading: boolean;
}

export const Tick = (p: IProps) => {
  const wrapper = (inner: JSX.Element): JSX.Element => <div className="tick-wrapper">{inner} </div>;
  if (p.loading === true) {
    return wrapper(<div key="loading" className="tick f-modal-icon f-modal-loading scaleLoading" />);
  }
  if (p.complete === true) {
    return wrapper((
      <div key="complete" className="tick f-modal-icon f-modal-success animate">
        <span className="f-modal-line f-modal-tip animateSuccessTip"/>
        <span className="f-modal-line f-modal-long animateSuccessLong"/>
        <div className="f-modal-placeholder"/>
        <div className="f-modal-fix"/>
      </div>
    ));
  }
  return wrapper((
    <div key="incomplete" className="tick f-modal-icon f-modal-success">
      <div className="f-modal-placeholder"/>
      <div className="f-modal-fix"/>
    </div>
  ));
};
