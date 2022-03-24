import React, { useEffect, useState } from "react";
import ReactJoyride, { CallBackProps, Placement, Step } from "react-joyride";
import { TourStage, tourStageAction, useTourActive } from "redux/modules/tour";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { TourTooltip } from "./tooltip";

export interface POI {
  target: string;
  content: string;
  title?: string;
  position?: Placement;
  spotlightClickThrough?: boolean;
  isComplete?: boolean;
  disableScrolling?: boolean;
  disableOverlay?: boolean;
}

export interface IProps {
  stage: TourStage;
  // null = stop tour, undefined = no transition required
  transitionOnLocationChange?: TourStage | null;
  transitionOnUnmount?: TourStage | null;
  steps: POI[];
  forceOn?: boolean;
}

export const TourPointer = (p: IProps): JSX.Element => {
  const active = p.forceOn || useTourActive(p.stage);
  const [iteration, setIteration] = useState<number>(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const [idx, setIdx] = useState<number>(0);

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

  const callback = (data: CallBackProps) => {
    if (data.index && data.index !== idx) {
      setIdx(data.index);
    }
    if (data.type === "error:target_not_found") {
      console.error(
        `TourPointer: ${data.step.target} not found. Is it a valid CSS selector?`
      );
    }
    if (data.type === "tour:end") {
      dispatch(tourStageAction(null, p.stage));
    }
  };

  const multipleSteps = p.steps.length > 1;
  const interactive = p.steps[idx].spotlightClickThrough !== false;

  return (
    <ReactJoyride
      key={iteration}
      run={active}
      callback={callback}
      continuous={multipleSteps}
      showProgress={multipleSteps}
      disableOverlayClose={true}
      steps={p.steps.map<Step>((s) => ({
        placement: s.position,
        content: s.content,
        target: s.target,
        title: s.title,
        disableBeacon: true,
        hideCloseButton: true,
        spotlightClicks: s.spotlightClickThrough ?? true,
        nonce: "" + (s.isComplete ?? true),
        disableOverlay: s.disableOverlay ?? false,
        disableScrolling: s.disableScrolling ?? false,
      }))}
      styles={{
        options: {
          arrowColor: interactive ? "#fff" : "transparent",
        },
        overlay: {
          cursor: interactive ? "default" : "not-allowed",
        },
      }}
      tooltipComponent={TourTooltip}
    />
  );
};
