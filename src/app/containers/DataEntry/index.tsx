import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, getMeeting} from 'apollo/modules/meetings';
import 'rc-slider/assets/index.css';
import { Grid, Loader } from 'semantic-ui-react';
import './style.less';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IURLConnector} from 'redux/modules/url';
import {IAnswer} from 'models/answer';
import {IQuestion, Question} from 'models/question';
import {QuestionInline} from 'components/QuestionInline';
import {renderArray} from '../../helpers/react';
import {getHumanisedDateFromISO} from '../../helpers/moment';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  data: IMeetingResult;
  params: {
      id: string,
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
}

interface IState {
    saving?: boolean;
}

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data !== undefined && ownProps.data.getMeeting !== undefined) {
    out.questions = (ownProps.data.getMeeting.outcomeSet.questions || [])
      .filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class DataEntryInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
    this.completed = this.completed.bind(this);
    this.setSaving = this.setSaving.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
  }

  private completed() {
    this.props.setURL(`/beneficiary/${this.props.data.getMeeting.beneficiary}`, `?q=${this.props.data.getMeeting.outcomeSetID}`);
  }

  private setSaving(toSet: boolean) {
    return () => {
      this.setState({
        saving: toSet,
      });
    };
  }

  private renderQuestion(q: Question, idx: number): JSX.Element {
    return (
      <QuestionInline
        key={q.id}
        index={idx+1}
        record={this.props.data.getMeeting}
        questionID={q.id}
        onSaving={this.setSaving(true)}
        onSaved={this.setSaving(false)}
        disabled={this.state.saving}
      />
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container columns={1} id="data-entry">
          <Grid.Column>
            <Helmet>
              <title>Data Entry</title>
            </Helmet>
            <div>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };

    const meeting = this.props.data.getMeeting;
    if (meeting === undefined) {
        return wrapper(<Loader active={true} inline="centered" />);
    }

    return wrapper((
      <div>
        <h1>{meeting.beneficiary} - {getHumanisedDateFromISO(meeting.conducted)}</h1>
        {renderArray(this.renderQuestion, this.props.questions)}
      </div>
    ));
  }
}
const DataEntry = getMeeting<IProps>((props) => props.params.id)(DataEntryInner);
export { DataEntry }
