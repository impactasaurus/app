import * as React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import {RadarChartStatic} from 'components/RadarChartStatic';
import {RadarData} from 'models/radar';
import './style.less';

export class TimelineEntry extends React.Component<any, any> {

  public render() {
    const d: RadarData = {
      scaleMin: 0,
      scaleMax: 10,
      series: [{
        name: 'test',
        datapoints: [{
          axis: 'a',
          value: 10,
        }, {
          axis: 'b',
          value: 4,
        }, {
          axis: 'c',
          value: 2,
        }, {
          axis: 'd',
          value: 3,
        }, {
          axis: 'e',
          value: 4,
        }, {
          axis: 'f',
          value: 8,
        }, {
          axis: 'g',
          value: 6,
        }],
      }],
    };
    return (
      <Feed.Event className="timeline-entry">
        <Feed.Label>
          <RadarChartStatic data={d} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <a>AB527</a> completed <a>Wellbeing Checklist</a>
            <Feed.Date>3 days ago</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text={true}>
            this was the first week for this gardener who freely chatted to the other gardeners especially B2 whilst they were working.
          </Feed.Extra>
          <Feed.Meta>
            <Label>Maybridge</Label>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}
