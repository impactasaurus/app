import React, { useEffect, useState } from "react";
import ReactJoyride, { CallBackProps, Placement, Step } from "react-joyride";
import { TourStage, tourStageAction, useTourActive } from "redux/modules/tour";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.less";

export interface POI {
  target: string;
  content: string;
  title?: string;
  position?: Placement;
  spotlightClickThrough?: boolean;
}

export interface IProps {
  stage: TourStage;
  // null = stop tour, undefined = no transition required
  transitionOnLocationChange?: TourStage | null;
  transitionOnUnmount?: TourStage | null;
  steps: POI[];
}

export const TourPointer = (p: IProps): JSX.Element => {
  const active = useTourActive(p.stage);
  const [iteration, setIteration] = useState<number>(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    if (data.type === "tour:end") {
      dispatch(tourStageAction(null, p.stage));
    }
  };

  const multipleSteps = p.steps.length > 1;

  return (
    <ReactJoyride
      key={iteration}
      run={active}
      callback={callback}
      continuous={multipleSteps}
      showProgress={multipleSteps}
      steps={p.steps.map<Step>((s) => ({
        placement: s.position,
        content: s.content,
        target: s.target,
        title: s.title,
        disableBeacon: true,
        hideCloseButton: true,
        spotlightClicks: s.spotlightClickThrough ?? true,
      }))}
      styles={{
        options: {
          primaryColor: "var(--brand-color)",
        },
      }}
      locale={{
        back: t("Back"),
        close: t("Close"),
        last: t("Close"),
        next: t("Next"),
      }}
    />
  );
};
