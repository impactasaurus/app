import * as React from "react";
import { Card, Popup } from "semantic-ui-react";
import { RadarChartStatic } from "components/RadarChartStatic";
import { IMeeting } from "models/meeting";
import { MeetingRadarWithImpl } from "components/MeetingRadar";
import { Aggregation } from "models/pref";
import "./style.less";
import { journeyURI, questionnaireURI, recordURI } from "helpers/url";
import { Tags } from "../Tag";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { ISODateString, ISOTimeSince } from "components/Moment";

interface IProp {
  meeting: IMeeting;
}

export class TimelineEntry extends React.Component<IProp, null> {
  constructor(props: IProp) {
    super(props);
  }

  public render(): JSX.Element {
    const Radar = MeetingRadarWithImpl(RadarChartStatic);
    const m = this.props.meeting;
    return (
      <Card>
        <Link
          className="topper"
          to={journeyURI(m.beneficiary, m.outcomeSet.id)}
        >
          <Radar meetings={[m]} aggregation={Aggregation.QUESTION} />
        </Link>
        <Card.Content>
          <Card.Header>
            <Trans
              defaults="<bLink>{beneficiaryID}</bLink> completed <qLink>{questionnaireName}</qLink>"
              values={{
                beneficiaryID: m.beneficiary,
                questionnaireName: m.outcomeSet.name,
              }}
              components={{
                bLink: <Link to={journeyURI(m.beneficiary, m.outcomeSet.id)} />,
                qLink: <Link to={questionnaireURI(m.outcomeSet.id)} />,
              }}
            />
          </Card.Header>
          <Card.Meta>
            <Popup
              trigger={
                <span className="date">
                  <ISOTimeSince iso={m.conducted} />
                </span>
              }
              content={<ISODateString iso={m.conducted} />}
            />
          </Card.Meta>
          <Card.Description as={Link} to={recordURI(m.id)}>
            {m.notes &&
              `${m.notes.slice(0, 100)}${m.notes.length > 100 ? "..." : ""}`}
          </Card.Description>
        </Card.Content>
        <Card.Content extra={true} className={`tags-${m.tags.length}`}>
          <Tags benTags={m.benTags} recordTags={m.meetingTags} />
        </Card.Content>
      </Card>
    );
  }
}
