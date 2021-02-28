import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingMutation, newMeeting, newRemoteMeeting} from 'apollo/modules/meetings';
import {IURLConnector, setURL} from 'redux/modules/url';
import { AssessmentType, IAssessmentConfig, defaultRemoteMeetingLimit } from 'models/assessment';
import { bindActionCreators } from 'redux';
import { Grid, Message, Button } from 'semantic-ui-react';
import {AssessmentConfig as AssessmentConfigComponent} from 'components/AssessmentConfig';
import {QuestionnaireRequired} from 'components/QuestionnaireRequired';
import {SummonConfig} from './summonConfig';
import {generateSummon, IGenerateSummon} from '../../apollo/modules/summon';
const { connect } = require('react-redux');
const config = require('../../../../config/main');
const ReactGA = require('react-ga');

const ConfigComponent = QuestionnaireRequired(AssessmentConfigComponent);

interface IProp extends IMeetingMutation, IURLConnector, IGenerateSummon {
  match: {
    params: {
      type: string,
    },
  };
  location: {
    search: string,
  };
}

interface IState {
  link?: string;
  typ: AssessmentType;
}

function getBen(p: IProp): string|undefined {
  const urlParams = new URLSearchParams(p.location.search);
  return urlParams.has('ben') ? urlParams.get('ben') : undefined;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class AssessmentConfigInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      typ: AssessmentType[this.props.match.params.type],
    };
    this.shouldGetDate = this.shouldGetDate.bind(this);
    this.startMeeting = this.startMeeting.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.isUnknownType = this.isUnknownType.bind(this);
    this.getType = this.getType.bind(this);
    this.recordMeetingStarted = this.recordMeetingStarted.bind(this);
    this.getButtonText = this.getButtonText.bind(this);
    this.setType = this.setType.bind(this);
    this.generateSummon = this.generateSummon.bind(this);
  }

  private getType(): AssessmentType {
    // we duplicate type to state so we can adjust it within the component
    // we do not offer summon type external to this page
    // instead we offer remote, which covers remote and summon types
    return this.state.typ;
  }

  private recordMeetingStarted() {
    ReactGA.event({
      category: 'assessment',
      action: 'started',
      label: AssessmentType[this.getType()],
    });
  }

  private startMeeting(config: IAssessmentConfig): Promise<void> {
    if (this.getType() === AssessmentType.remote) {
      return this.props.newRemoteMeeting(config, defaultRemoteMeetingLimit)
      .then((jti) => {
        this.recordMeetingStarted();
        this.setState({
          link: `jti/${jti}`,
        });
      });
    } else {
      if (this.shouldGetDate() === false) {
        config.date = new Date();
      }
      return this.props.newMeeting(config)
      .then((meeting) => {
        this.recordMeetingStarted();
        if (this.getType() === AssessmentType.historic) {
          this.props.setURL(`/dataentry/${meeting.id}`);
        } else {
          this.props.setURL(`/meeting/${meeting.id}`);
        }
      });
    }
  }

  private generateSummon(qsID: string): Promise<void> {
    return this.props.generateSummon(qsID)
      .then((smn) => {
        this.recordMeetingStarted();
        this.setState({
          link: `smn/${smn}`,
        });
      });
  }

  private shouldGetDate() {
    return this.getType() === AssessmentType.historic;
  }

  private isUnknownType(): boolean {
    return this.getType() === undefined;
  }

  private renderLink(): JSX.Element {
    const url = `${config.app.root}/${this.state.link}`;
    const recipient = this.getType() === AssessmentType.summon ? 'beneficiaries' : 'beneficiary';
    return (
      <Message success={true}>
        <Message.Header>Success</Message.Header>
        <div>Please provide the following link to your {recipient}. <b>They have {defaultRemoteMeetingLimit} days to complete the questionnaire</b></div>
        <a href={url}>{url}</a>
      </Message>
    );
  }

  private getButtonText(): string {
    return this.getType() === AssessmentType.remote || this.getType() === AssessmentType.summon ? 'Generate Link' : 'Start';
  }

  private setType(type: AssessmentType) {
    return () => {
      this.setState({
        typ: type,
      });
    };
  }

  private renderInner(): JSX.Element {
    if (this.isUnknownType()) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Unknown assessment type</div>
        </Message>
      );
    }
    if (this.state.link !== undefined) {
      return this.renderLink();
    }
    const showRemoteTypeSelector = (this.getType() === AssessmentType.remote || this.getType() === AssessmentType.summon) && getBen(this.props) === undefined;
    const showAssessmentConfig = this.getType() !== AssessmentType.summon;
    const showSummonConfig = this.getType() === AssessmentType.summon;
    return (
      <div>
        <div key="remote-type-select" style={{
          display: showRemoteTypeSelector ? 'block' : 'none',
          marginBottom: '2em',
        }}>
          <Button.Group>
            <Button key="remote" active={this.getType() === AssessmentType.remote} onClick={this.setType(AssessmentType.remote)}>Single Beneficiary</Button>
            <Button.Or key="or"/>
            <Button key="summon" active={this.getType() === AssessmentType.summon} onClick={this.setType(AssessmentType.summon)}>Multiple Beneficiaries</Button>
          </Button.Group>
        </div>
        <div key="assessment-config" style={{display: showAssessmentConfig ? 'block' : 'none'}}>
          <ConfigComponent
            defaultBen={getBen(this.props)}
            showDatePicker={this.shouldGetDate()}
            onSubmit={this.startMeeting}
            buttonText={this.getButtonText()}
          />
        </div>
        <div key="summon-config" style={{display: showSummonConfig ? 'block' : 'none'}}>
          <Message info={true}>
            <p>
              Beneficiaries will be asked for their beneficiary ID before they answer the questionnaire.
              When sending the link, ensure that your beneficiaries know what ID they should be using.
            </p>
            <p>
              As beneficiary IDs are provided by the recipient of the link, there is potential for abuse.
              If your beneficiaries know each others IDs, they could answer the questionnaire pretending to be another beneficiary.
              In this case, you should use single beneficiary links instead.
            </p>
          </Message>
          <SummonConfig buttonText={this.getButtonText()} onSubmit={this.generateSummon} />
        </div>
      </div>
    );
  }

  private getTitle() {
    return this.getType() === AssessmentType.summon || this.getType() === AssessmentType.remote ?
      'New Link' :
      'New Record';
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="assessment-config">
        <Grid.Column>
          <Helmet title={this.getTitle()}/>
          <h1>{this.getTitle()}</h1>
          {this.renderInner()}
        </Grid.Column>
      </Grid>
    );
  }
}

const AssessmentConfig = newRemoteMeeting<IProp>(newMeeting<IProp>(generateSummon<IProp>(AssessmentConfigInner)));
export { AssessmentConfig };
