import * as React from "react";
import { Responsive, Button } from "semantic-ui-react";
import { IURLConnector, UrlHOC } from "../../redux/modules/url";
import { OnboardingChecklist } from "components/OnboardingChecklist";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import { ActivityFeed } from "components/ActivityFeed";
import "./style.less";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { getRecentMeetings, IGetRecentMeetings } from "apollo/modules/meetings";
import { TooltipButton } from "components/TooltipButton";

interface IProps extends IURLConnector {
  data?: IGetRecentMeetings;
}

const HomeInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const newRecord = () => {
    p.setURL("/record");
  };
  const recordCount = p?.data?.getRecentMeetings?.meetings?.length;
  return (
    <div>
      <div>
        <span className="title-holder">
          <Responsive
            as={Button}
            minWidth={620}
            icon="plus"
            content={t("New Record")}
            primary={true}
            onClick={newRecord}
          />
          <Responsive
            as={TooltipButton}
            maxWidth={619}
            buttonProps={{
              icon: "plus",
              primary: true,
              onClick: newRecord,
            }}
            tooltipContent={t("New Record")}
          />
        </span>
        <OnboardingChecklist
          dismissible={recordCount > 0}
          forceDismiss={recordCount > 8}
        />
      </div>
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
const homeWithPageWrapper = MinimalPageWrapperHoC("Home", "home", HomeWithData);
export const Home = UrlHOC(homeWithPageWrapper);
