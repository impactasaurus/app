import * as React from "react";
import ReactJoyride from "react-joyride";
import { isTourActive, TourStage, tourStageAction } from "redux/modules/tour";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export interface IProps {
  target: string;
  content: string;
  stage: TourStage;
  title?: string;
  transitionOnLocationChange?: TourStage;
}

export const TourPointer = (p: IProps): JSX.Element => {
  const active = useSelector(isTourActive(p.stage));
  const [iteration, setIteration] = React.useState<number>(0);
  const location = useLocation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    setIteration(iteration + 1);
  }, [active]);

  React.useEffect(() => {
    if (active && p.transitionOnLocationChange) {
      dispatch(tourStageAction(p.transitionOnLocationChange, p.stage));
    }
  }, [location.pathname]);

  return (
    <ReactJoyride
      key={iteration}
      run={active}
      steps={[
        {
          target: p.target,
          content: p.content,
          title: p.title,
          disableBeacon: true,
          spotlightClicks: true,
          hideCloseButton: true,
        },
      ]}
    />
  );
};
