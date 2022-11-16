import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RecordFilter } from "components/RecordFilter";
import { ActivityFeedEntries, IFeedFilters } from "./feed";
import { Button, Responsive } from "semantic-ui-react";
import { useNavigator } from "redux/modules/url";
import { TooltipButton } from "components/TooltipButton";

export const ActivityFeed = (): JSX.Element => {
  const { t } = useTranslation();
  const setURL = useNavigator();

  const [filters, setFilters] = useState<IFeedFilters>();
  const [it, setIt] = useState<number>(0);
  const onChange = (
    bens: string[],
    questionnaires: string[],
    users: string[],
    tags: string[]
  ) => {
    setFilters({ bens, questionnaires, users, tags });
    setIt(it + 1);
  };

  const newRecord = () => {
    setURL("/record");
  };

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
        <h1>{t("Activity")}</h1>
        <RecordFilter onChange={onChange} />
      </div>
      <ActivityFeedEntries filter={filters} key={`activity-feed-${it}`} />
    </div>
  );
};
