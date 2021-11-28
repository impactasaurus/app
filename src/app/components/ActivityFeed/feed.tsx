import React from "react";
import {
  getMoreRecentMeetings,
  getRecentMeetings,
  IGetRecentMeetings,
} from "apollo/modules/meetings";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import InfiniteScroll from "react-infinite-scroller";
import { Card, Loader, Responsive, SemanticWIDTHS } from "semantic-ui-react";
import { ActivityFeedEntry } from "components/ActivityFeedEntry";
import { IMeeting } from "models/meeting";
import { renderArray } from "helpers/react";

export interface IFeedFilters {
  bens: string[];
  users: string[];
  questionnaires: string[];
  tags: string[];
}

interface IProps {
  filter: IFeedFilters;
  data?: IGetRecentMeetings;
}

const entry = (m: IMeeting): JSX.Element => (
  <ActivityFeedEntry key={m.id} meeting={m} />
);

const cards = (meetings: IMeeting[], perRow: SemanticWIDTHS): JSX.Element => (
  <Card.Group itemsPerRow={perRow}>{renderArray(entry, meetings)}</Card.Group>
);

const recordCount = (d: IGetRecentMeetings): number | undefined => {
  if (!d?.getRecentMeetings?.meetings) {
    return undefined;
  }
  return d.getRecentMeetings.meetings.length;
};

const ActivityFeedInner = (p: IProps) => {
  const loadMore = () => {
    p.data.fetchMore(getMoreRecentMeetings(p.data.getRecentMeetings.page + 1));
  };

  const rCount = recordCount(p?.data);
  if (rCount === 0) {
    return <div />;
  }

  const d = p.data.getRecentMeetings;
  return (
    <InfiniteScroll
      initialLoad={false}
      loadMore={loadMore}
      hasMore={d.isMore}
      loader={
        <Loader
          className="end-of-timeline"
          key="spinner"
          active={true}
          inline="centered"
        />
      }
      style={{
        marginTop: "0.875em", // counter-act negative margin on .ui.four.cards
      }}
    >
      <Responsive minWidth={990}>{cards(d.meetings, 4)}</Responsive>
      <Responsive minWidth={700} maxWidth={989}>
        {cards(d.meetings, 3)}
      </Responsive>
      <Responsive minWidth={500} maxWidth={699}>
        {cards(d.meetings, 2)}
      </Responsive>
      <Responsive maxWidth={499}>{cards(d.meetings, 1)}</Responsive>
    </InfiniteScroll>
  );
};

// t("activity feed")
const ActivityFeedWithSpinner = ApolloLoaderHoC<IProps>(
  "activity feed",
  (p) => p.data,
  ActivityFeedInner
);

export const ActivityFeedEntries = getRecentMeetings<IProps>(
  () => 0,
  "data",
  (p) => p.filter?.bens,
  (p) => p.filter?.questionnaires,
  (p) => p.filter?.users,
  (p) => p.filter?.tags
)(ActivityFeedWithSpinner);
