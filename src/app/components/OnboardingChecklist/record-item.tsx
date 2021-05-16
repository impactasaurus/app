import * as React from "react";
import { OnboardingChecklistItem } from "./item";
import {
  getRecentMeetings,
  IGetRecentMeetings,
} from "../../apollo/modules/meetings";
import { useTranslation } from "react-i18next";

interface IProps {
  data?: IGetRecentMeetings;
  index: number;
  minimal?: boolean; // defaults to false
}

const Inner = (p: IProps) => {
  const loading = p.data.loading;
  const completed =
    !loading &&
    p.data.getRecentMeetings &&
    p.data.getRecentMeetings.meetings.length > 0;
  const { t } = useTranslation();
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
    />
  );
};

export const RecordChecklistItem = getRecentMeetings<IProps>(() => 0)(Inner);
