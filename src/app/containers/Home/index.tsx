import * as React from "react";
import { OnboardingChecklist } from "components/OnboardingChecklist";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { ActivityFeed } from "components/ActivityFeed";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { getRecentMeetings, IGetRecentMeetings } from "apollo/modules/meetings";
import "./style.less";

interface IProps {
  data?: IGetRecentMeetings;
}

const HomeInner = (p: IProps): JSX.Element => {
  const recordCount = p?.data?.getRecentMeetings?.meetings?.length;
  return (
    <div>
      <OnboardingChecklist
        dismissible={recordCount > 0}
        forceDismiss={recordCount > 8}
      />
      {recordCount > 0 && <ActivityFeed />}
    </div>
  );
};

// t("activity feed")
const HomeWithSpinner = ApolloLoaderHoC<IProps>(
  "activity feed",
  (p) => p.data,
  HomeInner
);

export const HomeWithData = getRecentMeetings<IProps>({})(HomeWithSpinner);

// t("Home")
export const Home = MinimalPageWrapperHoC("Home", "home", HomeWithData);
