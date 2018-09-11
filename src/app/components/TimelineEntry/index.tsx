import * as React from 'react';
import {Card, Label} from 'semantic-ui-react';
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
      <Card>
        <div>
          <Radar meetings={[m]} aggregation={Aggregation.QUESTION} />
        </div>
        <Card.Content>
          <Card.Header>
            <a>{m.beneficiary}</a> completed <a>{m.outcomeSet.name}</a>
          </Card.Header>
          <Card.Meta>
            <span className="date">
              {getHumanisedTimeSinceDate(new Date(m.conducted))}
              </span>
          </Card.Meta>
          <Card.Description>
            {m.notes && m.notes.replace(/^(.{100}).+/, '$1…')}
          </Card.Description>
        </Card.Content>
        <Card.Content extra={true} className={`tags-${m.tags.length}`}>
          {renderArray(label, m.tags)}
        </Card.Content>
      </Card>
    );
  }
}
