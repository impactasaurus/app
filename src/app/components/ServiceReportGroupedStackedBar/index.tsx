import * as React from 'react';
import {IBeneficiaryAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {GroupedStackedBarChart, IGroupedBarChartData} from '../BarChartGroupedStacked';
import {getQuestionFriendlyName, getQuestions} from '../../helpers/questionnaire';
import {IBenSummary} from '../../models/report';

interface IProp {
  report: IBeneficiaryAggregationReport;
  questionSet: IOutcomeSet;

}

class ServiceReportGroupedStackedBar extends React.Component<IProp, any> {

  /*
  {
        labels:['Question 1', 'Question 2', 'Question 3'],
        series:[{
          before: [1,2,3],
          after: [0,1,3],
          label: '1',
        }, {
          before: [2,2,3],
          after: [3,2,3],
          label: '2',
        }, {
          before: [5,2,4],
          after: [4,2,4],
          label: '3',
        }, {
          before: [3,2,3],
          after: [4,3,1],
          label: '4',
        }, {
          before: [3,6,1],
          after: [3,6,3],
          label: '5',
        }],
      }
   */

  private getQuestionBarData(beneficiaries: IBenSummary[], qs: IOutcomeSet): IGroupedBarChartData {
    const series = [];
    const questionIdx = getQuestions(qs).reduce((map, q, idx) => {
      map[q.id] = idx;
      return map;
    }, {});
    const logAnswer = (qID, before, after) => {
      const qIdx = questionIdx[qID];
      if (series[before] === undefined) {
        series[before] = {before:[], after:[], label: ''+before};
      }
      if (series[after] === undefined) {
        series[after] = {before:[], after:[], label: ''+after};
      }
      if (series[before].before[qIdx] === undefined) {
        series[before].before[qIdx] = 0;
      }
      if (series[after].after[qIdx] === undefined) {
        series[after].after[qIdx] = 0;
      }
      series[before].before[qIdx]++;
      series[after].after[qIdx]++;
    };
    beneficiaries.forEach((b) => {
      b.questions.forEach((bq) => {
        logAnswer(bq.aID, bq.initial.value, bq.latest.value);
      });
    });
    series.forEach((s) => {
      s.before = s.before.map((v) => v ? v : 0);
      s.after = s.after.map((v) => v ? v : 0);
    });
    return {
      labels: Object.keys(questionIdx).map((qID) => getQuestionFriendlyName(qID, qs, true)),
      series,
    };
  }

  private getBarData(p: IProp): IGroupedBarChartData {
    const beneficiaryData = p.report.beneficiaries;
    return this.getQuestionBarData(beneficiaryData, p.questionSet);
  }

  private renderGraph(p: IProp): JSX.Element {
    if (p.report.beneficiaries.length === 0) {
      return (<div />);
    }
    const data = this.getBarData(p);
    return (
      <GroupedStackedBarChart data={data} xAxisLabel="Percentage" showPercentage={true}/>
    );
  }

  public render() {
    return (
      <div className="service-report-grouped-stacked-bar">
        {this.renderGraph(this.props)}
      </div>
    );
  }
}

export {ServiceReportGroupedStackedBar};
