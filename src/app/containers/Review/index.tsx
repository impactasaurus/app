import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Select, DropdownItemProps } from 'semantic-ui-react';
import {VizControlPanel} from 'components/VizControlPanel';
const { connect } = require('react-redux');
import {IStore} from 'redux/IStore';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {MeetingRadar} from 'components/MeetingRadar';
import {MeetingTable} from 'components/MeetingTable';
import './style.less';

interface IProps {
  params: {
      id: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
};

interface IState {
  selectedQuestionSetID: string;
}

function isCategoryAggregationAvailable(meetings: IMeeting[]): boolean {
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return false;
  }
  const meetingsWithCategories = meetings.filter((m) => {
    return m.outcomeSet.categories.length > 0;
  });
  return meetingsWithCategories.length > 0;
}

@connect((state: IStore, ownProps: IProps) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps.data.getMeetings);
  return {
    vis: getVisualisation(state.pref),
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
  };
}, undefined)
class ReviewInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedQuestionSetID: null,
    };
    this.renderInner = this.renderInner.bind(this);
    this.renderVis = this.renderVis.bind(this);
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const meetings = nextProps.data.getMeetings;
    if(this.state.selectedQuestionSetID === null &&
      Array.isArray(meetings) &&
      meetings.length > 0) {
        this.setState({
          selectedQuestionSetID: meetings[0].outcomeSetID,
        });
      }
  }

  private filterMeetings(m: IMeeting[], questionSetID: string): IMeeting[] {
    return m.filter((m) => m.outcomeSetID === questionSetID);
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (!Array.isArray(p.data.getMeetings) || p.data.getMeetings.length === 0) {
      return (
        <p>No meetings found for beneficiary {p.params.id}</p>
      );
    }

    const meetings = this.filterMeetings(p.data.getMeetings, this.state.selectedQuestionSetID);

    if (p.vis === Visualisation.RADAR) {
      return (
        <MeetingRadar aggregation={p.agg} meetings={meetings} />
      );
    }
    return (
      <MeetingTable aggregation={p.agg} meetings={meetings} />
    );
  }

  private getQuestionSetOptions(ms: IMeeting[]): DropdownItemProps[] {
    if (!Array.isArray(ms)) {
      return [];
    }
    const questionSetMap = ms.reduce((qs, m) => {
      if (qs[m.outcomeSetID] !== undefined) {
        return qs;
      }
      qs[m.outcomeSetID] = {
        key: m.outcomeSetID,
        value: m.outcomeSetID,
        text: m.outcomeSet.name,
      };
      return qs;
    }, {});
    return Object.keys(questionSetMap).map((qsID) => questionSetMap[qsID]);
  }

  private setQuestionSetID(_, data) {
    this.setState({
      selectedQuestionSetID: data.value,
    });
  }

  private renderInner(): JSX.Element {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <div>
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} />
        <Select className="qs-selector"
          value={this.state.selectedQuestionSetID}
          onChange={this.setQuestionSetID}
          options={this.getQuestionSetOptions(this.props.data.getMeetings)}
        />
        {this.renderVis()}
      </div>
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    return (
      <Grid container columns={1}>
        <Grid.Column>
          <div id="review">
            <Helmet>
              <title>{this.props.params.id + ' Review'}</title>
            </Helmet>
            <h1>{this.props.params.id}</h1>
            {this.renderInner()}
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

const Review = getMeetings<IProps>((p) => p.params.id)(ReviewInner);
export { Review }
