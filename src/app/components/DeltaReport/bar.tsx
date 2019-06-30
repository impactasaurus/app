import * as React from 'react';
import {IBeneficiaryDeltaReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {StackedBarChart} from 'components/BarChartStacked';
import {IBarChartData} from 'models/bar';
import {getCategoryFriendlyName, getQuestionFriendlyName} from 'helpers/questionnaire';
import {extractDeltas, IDelta} from 'components/DeltaReport/data';

interface IProp {
  report: IBeneficiaryDeltaReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

const getBarChartData = (category: boolean, report: IBeneficiaryDeltaReport, questionnaire: IOutcomeSet): IBarChartData => {
  const data = extractDeltas(category, report, questionnaire);
  return data.reduce<IBarChartData>((chart: IBarChartData, d: IDelta): IBarChartData => {
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
