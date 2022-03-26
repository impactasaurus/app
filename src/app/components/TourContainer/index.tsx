import React, { useEffect } from "react";
import { TourStage, tourStageAction, useTourActive } from "redux/modules/tour";
import { useDispatch } from "react-redux";

interface IProps {
  stage: TourStage;
  // null = stop tour, undefined = no transition required
  transitionOnUnmount?: TourStage | null;
  forceOn?: boolean;
  children: JSX.Element;
}

// TourContainer shows its children only if the current
// tour stage matches the stage provided in props
export const TourContainer = (p: IProps): JSX.Element => {
  const active = p.forceOn || useTourActive(p.stage);
  const dispatch = useDispatch();

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

  if (!active) {
    return <div />;
  }

  return p.children;
};
