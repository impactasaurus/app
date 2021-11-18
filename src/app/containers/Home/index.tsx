import * as React from "react";
import { Responsive, Button } from "semantic-ui-react";
import { IURLConnector, UrlHOC } from "../../redux/modules/url";
import { OnboardingChecklist } from "components/OnboardingChecklist";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation, WithTranslation } from "react-i18next";
import { ActivityFeed } from "components/ActivityFeed";
import "./style.less";

const HomeInner = (p: IURLConnector & WithTranslation) => {
  const newRecord = () => {
    p.setURL("/record");
  };
  const { t } = useTranslation();
  const [recordCount, setRecordCount] = React.useState<number | undefined>();
  return (
    <div>
      {recordCount !== undefined && (
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
              as={Button}
              maxWidth={619}
              icon="plus"
              primary={true}
              onClick={newRecord}
            />
          </span>
          <OnboardingChecklist
            dismissible={recordCount > 0}
            forceDismiss={recordCount > 8}
          />
        </div>
      )}
      <ActivityFeed onLoad={setRecordCount} />
    </div>
  );
};

// t("Home")
const homeWithPageWrapper = MinimalPageWrapperHoC("Home", "home", HomeInner);
export const Home = UrlHOC(homeWithPageWrapper);
