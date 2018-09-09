import * as React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import {RadarChartStatic} from 'components/RadarChartStatic';
import {IMeeting} from 'models/meeting';
import {MeetingRadarWithImpl} from '../MeetingRadar';
import {Aggregation} from 'models/pref';
import './style.less';
import {getHumanisedTimeSinceDate} from 'helpers/moment';
import {renderArray} from 'helpers/react';

interface IProp {
  meeting: IMeeting;
}

const label = (t: string) => <Label key={t}>{t}</Label>;

export class TimelineEntry extends React.Component<IProp, any> {

  public render() {
    const Radar = MeetingRadarWithImpl(RadarChartStatic);
    const m = this.props.meeting;
    return (
      <Feed.Event className="timeline-entry">
        <Feed.Label>
          <Radar meetings={[m]} aggregation={Aggregation.QUESTION} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <a>{m.beneficiary}</a> completed <a>{m.outcomeSet.name}</a>
            <Feed.Date>{getHumanisedTimeSinceDate(new Date(m.conducted))}</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text={true}>
            {m.notes ? m.notes : 'No notes'}
          </Feed.Extra>
          <Feed.Meta>
            {renderArray(label, m.tags)}
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}
