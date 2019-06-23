import * as React from 'react';
import {IAnswerDelta, IBenDeltaSummary, IBeneficiaryDeltaReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {StackedBarChart} from 'components/BarChartStacked';
import {IBarChartData} from 'models/bar';
import {getCategoryFriendlyName, getQuestionFriendlyName, getQuestions} from 'helpers/questionnaire';
interface IProp {
  report: IBeneficiaryDeltaReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

interface ICategoriedDeltas {
  id: string;
  category: boolean;
  decreased: number;
  same: number;
  increased: number;
}

const extractDeltas = (id: string, category: boolean, bens: IBenDeltaSummary[]): number[] => {
  return bens.reduce((deltas: number[], ben: IBenDeltaSummary): number[] => {
    const answers = category ? ben.categories : ben.questions;
    const answer = answers.find((a: IAnswerDelta) => a.aID === id);
    console.log(ben.id, answer);
    if (answer === undefined) {
      return deltas;
    }
    return deltas.concat(answer.stats.delta);
  }, []);
};

const extractCategorisedDeltas = (id: string, category: boolean, bens: IBenDeltaSummary[]): ICategoriedDeltas => {
  const deltas = extractDeltas(id, category,  bens);
  return deltas.reduce<ICategoriedDeltas>((categorised: ICategoriedDeltas, delta: number): ICategoriedDeltas => {
    if (delta < 0) {
      categorised.decreased++;
    } else if (delta === 0) {
      categorised.same++;
    } else {
      categorised.increased++;
    }
    return categorised;
  }, {
    decreased: 0,
    same: 0,
    increased: 0,
    category,
    id,
  });
};

const extractAllCategorisedDeltas = (category: boolean, report: IBeneficiaryDeltaReport, questionnaire: IOutcomeSet): ICategoriedDeltas[] => {
  const ids = category ?
    questionnaire.categories.map((c) => c.id) :
    getQuestions(questionnaire).map((q) => q.id);
  return ids.map((id) => extractCategorisedDeltas(id, category, report.beneficiaries));
};

const getBarChartData = (category: boolean, report: IBeneficiaryDeltaReport, questionnaire: IOutcomeSet): IBarChartData => {
  const data = extractAllCategorisedDeltas(category, report, questionnaire);
  return data.reduce<IBarChartData>((chart: IBarChartData, d: ICategoriedDeltas): IBarChartData => {
    const label = d.category ? getCategoryFriendlyName(d.id, questionnaire) : getQuestionFriendlyName(d.id, questionnaire);
    chart.labels.push(label);
    chart.series[0].data.push(d.decreased);
    chart.series[1].data.push(d.same);
    chart.series[2].data.push(d.increased);
    return chart;
  }, {
    labels: [],
    series:[{
      data: [],
      label: 'Decreased',
    }, {
      data: [],
      label: 'Same',
    }, {
      data: [],
      label: 'Increased',
    }],
  });
};

class DeltaReportStackedBarGraph extends React.Component<IProp, any> {
  public render() {
    return (
      <div className="delta-report-stacked-bar-graph">
        <StackedBarChart data={getBarChartData(this.props.category, this.props.report, this.props.questionSet)} xAxisLabel="Percentage" showPercentage={true}/>
      </div>
    );
  }
}

export {DeltaReportStackedBarGraph};
