import * as React from 'react';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {getOutcomeGraph} from '@ald-life/outcome-graph';
import {Loader, Checkbox} from 'semantic-ui-react';
import {Answer} from 'models/answer';
import './style.less';

let count = 0;

interface IProp {
  beneficiaryID: string;
  data?: IMeetingResult;
}

interface IState {
  categoryAg: boolean;
}

class MeetingViewInner extends React.Component<IProp, IState> {

  private canvasID: string;

  constructor(props) {
    super(props);
    this.state = {
      categoryAg: false,
    };
    this.canvasID = `meeting-view-${count++}`;
    this.toggleCategoryAggregation = this.toggleCategoryAggregation.bind(this);
    this.renderControlPanel = this.renderControlPanel.bind(this);
  }

  private getQuestionLevelData(meetings: IMeeting[]) {
    return meetings.map((meeting) => {
      const answers = meeting.answers.map((answer: Answer) => {
        const q = meeting.outcomeSet.questions.find((q) => q.id === answer.questionID);
        let question = 'Unknown Question';
        if (q !== undefined) {
          if (q.archived) {
            question = `${q.question} (archived)`;
          } else {
            question = q.question;
          }
        }
        return {
          outcome: question,
          value: answer.answer,
        };
      });
      return {
        timestamp: meeting.conducted,
        outcomes: answers,
      };
    });
  }

  private getCategoryLevelData(meetings: IMeeting[]) {
    return meetings.map((meeting) => {
      const answers = meeting.aggregates.category.map((categoryAg) => {
        let category = 'Unknown Category';
        const cat = meeting.outcomeSet.categories.find((c) => c.id === categoryAg.categoryID);
        if (cat !== undefined) {
          category = cat.name;
        }
        return {
          outcome: category,
          value: categoryAg.value,
        };
      });
      return {
        timestamp: meeting.conducted,
        outcomes: answers,
      };
    });
  }

  public componentWillReceiveProps(nextProps) {
    if (!this.isCategoryAggregationAvailable(nextProps) && this.state.categoryAg) {
      this.setState({
        categoryAg: false,
      });
    }
  }

  public componentDidUpdate() {
    if (this.props.data.getMeetings === undefined) {
      return;
    }
    const meetings = this.props.data.getMeetings;
    const data = this.state.categoryAg ? this.getCategoryLevelData(meetings) : this.getQuestionLevelData(meetings);
    getOutcomeGraph(this.canvasID, '', data);
  }

  private toggleCategoryAggregation() {
    this.setState({
      categoryAg: !this.state.categoryAg,
    });
  }

  private isCategoryAggregationAvailable(props): boolean {
    if (!Array.isArray(props.data.getMeetings) || props.data.getMeetings.length === 0) {
      return false;
    }
    const meetingsWithCategories = props.data.getMeetings.filter((m) => {
      return m.outcomeSet.categories.length > 0;
    });
    return meetingsWithCategories.length > 0;
  }

  private renderControlPanel(): JSX.Element {
    const cpItems: JSX.Element[] = [];
    if (this.isCategoryAggregationAvailable(this.props)) {
      cpItems.push((
        <span key="agtoggle">
          <Checkbox toggle label="Category Aggregation"  onChange={this.toggleCategoryAggregation} />
        </span>
      ));
    }
    return (
      <div id="cp">
        {cpItems}
      </div>
    );
  }

  public render() {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (!Array.isArray(this.props.data.getMeetings) ||
      this.props.data.getMeetings.length === 0) {
      return (
        <p>No meetings found for beneficiary {this.props.beneficiaryID}</p>
      );
    }
    return (
      <div className="meeting-view">
        <h2>{this.props.beneficiaryID}</h2>
        {this.renderControlPanel()}
        <div id="wrapper">
          <canvas id={this.canvasID} />
        </div>
      </div>
    );
  }
}

const MeetingView = getMeetings<IProp>((p) => p.beneficiaryID)(MeetingViewInner);
export { MeetingView }
