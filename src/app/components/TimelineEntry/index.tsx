import * as React from 'react';
import {Card, Popup} from 'semantic-ui-react';
import {RadarChartStatic} from 'components/RadarChartStatic';
import {IMeeting} from 'models/meeting';
import {MeetingRadarWithImpl} from 'components/MeetingRadar';
import {Aggregation} from 'models/pref';
import './style.less';
import {getHumanisedDateFromISO, getHumanisedTimeSinceDate} from 'helpers/moment';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {journey, questionnaire, record} from 'helpers/url';
import {Tags} from '../Tag';
const { connect } = require('react-redux');

interface IProp extends IURLConnector {
  meeting: IMeeting;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
export class TimelineEntry extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.navigateToJourney = this.navigateToJourney.bind(this);
    this.navigateToQuestionnaire = this.navigateToQuestionnaire.bind(this);
    this.navigateToRecord = this.navigateToRecord.bind(this);
  }

  private navigateToJourney = function(beneficiary: string, questionnaire: string): () => void {
    return () => journey(this.props.setURL, beneficiary, questionnaire);
  };

  private navigateToQuestionnaire = function(qID: string): () => void {
    return () => questionnaire(this.props.setURL, qID);
  };

  private navigateToRecord = function(rID: string): () => void {
    return () => record(this.props.setURL, rID);
  };

  public render() {
    const Radar = MeetingRadarWithImpl(RadarChartStatic);
    const m = this.props.meeting;
    return (
      <Card>
        <div className="topper" onClick={this.navigateToJourney(m.beneficiary, m.outcomeSet.id)}>
          <Radar meetings={[m]} aggregation={Aggregation.QUESTION} />
        </div>
        <Card.Content>
          <Card.Header>
            <a onClick={this.navigateToJourney(m.beneficiary, m.outcomeSet.id)}>{m.beneficiary}</a> completed <a onClick={this.navigateToQuestionnaire(m.outcomeSet.id)}>{m.outcomeSet.name}</a>
          </Card.Header>
          <Card.Meta>
            <Popup trigger={(
              <span className="date">{getHumanisedTimeSinceDate(new Date(m.conducted))}</span>
            )} content={getHumanisedDateFromISO(m.conducted)} />
          </Card.Meta>
          <Card.Description onClick={this.navigateToRecord(m.id)}>
            {m.notes && `${m.notes.slice(0, 100)}${m.notes.length > 100 ? '...' : ''}`}
          </Card.Description>
        </Card.Content>
        <Card.Content extra={true} className={`tags-${m.tags.length}`}>
          <Tags benTags={m.benTags} recordTags={m.meetingTags}/>
        </Card.Content>
      </Card>
    );
  }
}
