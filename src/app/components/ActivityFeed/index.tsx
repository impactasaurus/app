import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RecordFilter } from "components/RecordFilter";
import { ActivityFeedEntries, IFeedFilters } from "./feed";

interface IProps {
  onLoad?: (numberOfRecords: number) => void;
}

export const ActivityFeed = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
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
  return (
    <div>
      <h1>{t("Activity")}</h1>
      <RecordFilter onChange={onChange} />
      <ActivityFeedEntries
        onLoad={p.onLoad}
        filter={filters}
        key={`activity-feed-${it}`}
      />
    </div>
  );
};
