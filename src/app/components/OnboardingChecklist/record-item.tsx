import * as React from "react";
import { OnboardingChecklistItem } from "./item";
import {
  getRecentMeetings,
  IGetRecentMeetings,
} from "../../apollo/modules/meetings";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { TourStage, tourStageAction } from "redux/modules/tour";
import ReactGA from "react-ga4";

interface IProps {
  data?: IGetRecentMeetings;
  index: number;
  minimal?: boolean; // defaults to false
}

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClick = () => {
    ReactGA.event({
      category: "tour",
      label: "record",
      action: "started-onboarding-list",
    });
    dispatch(tourStageAction(TourStage.RECORD_1));
  };

  const loading = p.data.loading;
  const completed =
    !loading &&
    p.data.getRecentMeetings &&
    p.data.getRecentMeetings.meetings.length > 0;
  return (
    <OnboardingChecklistItem
      title={t("Create a record")}
      description={t(
        "When a beneficiary completes a questionnaire, the data is stored as a record in the system. Complete a questionnaire to create your first record."
      )}
      completed={completed}
      loading={loading}
      link="/record"
      index={p.index}
      minimal={p.minimal}
      onClick={onClick}
    />
  );
};

export const RecordChecklistItem = getRecentMeetings<IProps>({})(Inner);
