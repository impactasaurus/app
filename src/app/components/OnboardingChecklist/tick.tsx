import * as React from 'react';
import './tick.less';

interface IProps {
  complete: boolean;
  loading: boolean;
}

export const Tick = (p: IProps) => {
  if (p.loading === true) {
    return (
      <div key="loading" className="tick f-modal-icon f-modal-loading scaleLoading" />
    );
  }
  if (p.complete === true) {
    return (
      <div key="complete" className="tick f-modal-icon f-modal-success animate">
        <span className="f-modal-line f-modal-tip animateSuccessTip"/>
        <span className="f-modal-line f-modal-long animateSuccessLong"/>
        <div className="f-modal-placeholder"/>
        <div className="f-modal-fix"/>
      </div>
    );
  }
  return (
    <div key="incomplete" className="tick f-modal-icon f-modal-success">
      <div className="f-modal-placeholder"/>
      <div className="f-modal-fix"/>
    </div>
  );
};
