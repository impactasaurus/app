import React, { useEffect, useState } from "react";
import ReactJoyride, { Placement } from "react-joyride";
import { TourStage, tourStageAction, useTourActive } from "redux/modules/tour";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export interface IProps {
  target: string;
  content: string;
  stage: TourStage;
  title?: string;
  // null = stop tour, undefined = no transition required
  transitionOnLocationChange?: TourStage | null;
  transitionOnUnmount?: TourStage | null;
  position?: Placement;
}

export const TourPointer = (p: IProps): JSX.Element => {
  const active = useTourActive(p.stage);
  const [iteration, setIteration] = useState<number>(0);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    setIteration(iteration + 1);
  }, [active]);

  useEffect(() => {
    if (active && p.transitionOnLocationChange !== undefined) {
      dispatch(tourStageAction(p.transitionOnLocationChange, p.stage));
    }
  }, [location.pathname]);

  useEffect(() => {
    const onUnmount = () => {
      // had issues including active here, seemed to be false by the time we were unmounting.
      // could solve by adding an additional useEffect and dependency on active,
      // but tourStageAction supports conditional transitions, so just use that...
      if (p.transitionOnUnmount !== undefined) {
        dispatch(tourStageAction(p.transitionOnUnmount, p.stage));
      }
    };
    return onUnmount;
  }, []);

  const callback = (data) => {
    if (data.type === "tour:end") {
      dispatch(tourStageAction(null, p.stage));
    }
  };

  return (
    <ReactJoyride
      key={iteration}
      run={active}
      callback={callback}
      steps={[
        {
          target: p.target,
          content: p.content,
          title: p.title,
          disableBeacon: true,
          spotlightClicks: true,
          hideCloseButton: true,
          placement: p.position,
        },
      ]}
    />
  );
};
