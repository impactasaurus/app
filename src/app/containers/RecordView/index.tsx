import * as React from 'react';
import {Helmet} from 'react-helmet';
import {Button, Loader, Grid} from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {getMeeting, IMeetingResult} from 'apollo/modules/meetings';
import {bindActionCreators} from 'redux';
import './style.less';
import {RecordQuestionSummary} from 'components/RecordQuestionSummary';
import {getHumanisedDateFromISO} from 'helpers/moment';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string,
    },
  };
  location: {
    // can provide a ?next=relativeURL which the user will be taken to on cancel or successful save
    search: string,
  };
  data: IMeetingResult;
}

function getNextPageURL(p: IProps): string|undefined {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('next') === false) {
    return undefined;
  }
  return urlParams.get('next');
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class RecordViewInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
  }

  private nextPage() {
    const nextPage = getNextPageURL(this.props);
    if (nextPage !== undefined) {
      this.props.setURL(nextPage);
      return;
    }
    const record = this.props.data.getMeeting;
    if (record !== undefined) {
      this.props.setURL(`/beneficiary/${record.beneficiary}`);
      return;
    }
    this.props.setURL('/');
  }

  private noop(): Promise<void> {
    return Promise.resolve();
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="record-view">
          <Grid.Column>
            <Helmet>
              <title>View Record</title>
            </Helmet>
            <div>
              <h1>View Record</h1>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };

    if(this.props.match.params.id === undefined) {
      return wrapper(<div />);
    }

    const record = this.props.data.getMeeting;
    if(record === undefined) {
      return wrapper(<Loader active={true} inline="centered" />);
    }

    return wrapper((
      <div>
        <div className="impactform">
          <div>
            <h4 className="label inline">Beneficiary ID</h4>
            <span>{record.beneficiary}</span>
          </div>
          <div>
            <h4 className="label inline">Questionnaire</h4>
            <span>{record.outcomeSet.name}</span>
          </div>
          <div>
            <h4 className="label inline">Date Conducted</h4>
            <span className="conductedDate">{getHumanisedDateFromISO(record.conducted)}</span>
          </div>
        </div>
        <RecordQuestionSummary
          recordID={this.props.match.params.id}
          onQuestionClick={this.noop}
        />
        <div>
          <Button className="back" onClick={this.nextPage}>Back</Button>
        </div>
      </div>
    ));
  }
}

const RecordView = getMeeting<IProps>((props) => props.match.params.id)(RecordViewInner);
export { RecordView };
