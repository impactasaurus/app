import * as React from 'react';
import {Feed} from 'semantic-ui-react';
import {RadarChartStatic} from 'components/RadarChartStatic';
import './style.less';
import {RadarData} from '../../models/radar';

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
          value: 0,
        }, {
          axis: 'c',
          value: 5,
        }, {
          axis: 'd',
          value: 3,
        }],
      }],
    };
    return (
      <Feed.Event>
        <Feed.Label>
          <RadarChartStatic data={d} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <a>Joe Henderson</a> posted on his page
            <Feed.Date>3 days ago</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text={true}>
            Ours is a life of constant reruns. We're always circling back to where we'd we started,
            then starting all over again. Even if we don't run extra laps that day, we surely will
            come back for more of the same another day soon.
          </Feed.Extra>
          <Feed.Meta>
            <span>tag</span>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}
