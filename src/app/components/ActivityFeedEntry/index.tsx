import * as React from "react";
import { Card, Popup } from "semantic-ui-react";
import { RadarChartStatic } from "components/RadarChartStatic";
import { IMeeting } from "models/meeting";
import { MeetingRadarWithImpl } from "components/MeetingRadar";
import { Aggregation } from "models/pref";
import "./style.less";
import { journeyURI, recordURI } from "helpers/url";
import { Tags } from "../Tag";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { ISODateString, ISOTimeSince } from "components/Moment";

interface IProp {
  meeting: IMeeting;
}

const ActivityFeedEntry = (props: IProp): JSX.Element => {
  const Radar = MeetingRadarWithImpl(RadarChartStatic);
  const { meeting } = props;
  return (
    <Card className="activity-feed-entry">
      <Link
        className="topper"
        to={journeyURI(meeting.beneficiary, meeting.outcomeSet.id)}
      >
        <Radar meetings={[meeting]} aggregation={Aggregation.QUESTION} />
      </Link>
      <Card.Content>
        <Card.Header
          as={Link}
          to={journeyURI(meeting.beneficiary, meeting.outcomeSet.id)}
        >
          <Trans
            defaults="<bLink>{beneficiaryID}</bLink> completed <qLink>{questionnaireName}</qLink>"
            values={{
              beneficiaryID: meeting.beneficiary,
              questionnaireName: meeting.outcomeSet.name,
            }}
            components={{
              bLink: <span />,
              qLink: <span />,
            }}
          />
        </Card.Header>
        <Card.Meta>
          <Popup
            trigger={
              <span className="date">
                <ISOTimeSince iso={meeting.date} />
              </span>
            }
            content={<ISODateString iso={meeting.date} />}
          />
        </Card.Meta>
        <Card.Description as={Link} to={recordURI(meeting.id)}>
          {meeting.notes &&
            `${meeting.notes.slice(0, 100)}${
              meeting.notes.length > 100 ? "..." : ""
            }`}
        </Card.Description>
      </Card.Content>
      <Card.Content extra={true} className={`tags-${meeting.tags.length}`}>
        <Tags benTags={meeting.benTags} recordTags={meeting.meetingTags} />
      </Card.Content>
    </Card>
  );
};

export { ActivityFeedEntry };
