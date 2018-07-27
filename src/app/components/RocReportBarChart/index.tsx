import * as React from 'react';
import {IOutcomeSet} from 'models/outcomeSet';
import {BarChartData} from 'models/bar';
import {BarChart} from 'components/BarChart';
import {IQuestion} from 'models/question';
import {ICategory} from 'models/category';
import {
  convertCategoryValueToPercentage, convertQuestionValueToPercentage, getCategoryFriendlyName,
  getQuestionFriendlyName, getQuestions,
} from 'helpers/questionnaire';
import {IAnswerSummary, IBeneficiaryAggregationReport, IBenSummary} from 'models/report';

interface IProp {
  report: IBeneficiaryAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

class RocReportBarChart extends React.Component<IProp, any> {

  private getCategoryBarData(beneficiaries: IBenSummary[], qs: IOutcomeSet): BarChartData {
    const getCategoryForBeneficiary = (cID: string, bd: IBenSummary): IAnswerSummary|undefined => {
      return bd.categories.find((cRoc) => cRoc.aID === cID);
    };

    const aggregateCategoryROC = (c: ICategory): number|undefined => {
      let sum = 0, count = 0;
      beneficiaries.forEach((b) => {
        const benCatRoc = getCategoryForBeneficiary(c.id, b);
        if (benCatRoc !== undefined) {
          sum += benCatRoc.stats.roc;
          count += 1;
        }
      });
      if (count === 0) {
        return undefined;
      }
      return convertCategoryValueToPercentage(qs, c.id, sum / count);
    };

    const barData = qs.categories.reduce<any>((bcd, c) => {
      const qMeanROC = aggregateCategoryROC(c);
      if (qMeanROC !== undefined) {
        bcd.data.push(qMeanROC);
        bcd.labels.push(getCategoryFriendlyName(c.id, qs));
      }
      return bcd;
    }, {
      data: [],
      labels: [],
    });

    return {
      labels: barData.labels,
      series: [{
        label: 'Average Rate of Change',
        data: barData.data,
      }],
    };
  }

  private getQuestionBarData(beneficiaries: IBenSummary[], qs: IOutcomeSet): BarChartData {
    const getQuestionForBeneficiary = (qID: string, bd: IBenSummary): IAnswerSummary|undefined => {
      return bd.questions.find((qRoc) => qRoc.aID === qID);
    };

    const aggregateQuestionROC = (q: IQuestion): number|undefined => {
      let sum = 0, count = 0;
      beneficiaries.forEach((b) => {
        const benQRoc = getQuestionForBeneficiary(q.id, b);
        if (benQRoc !== undefined) {
          sum += benQRoc.stats.roc;
          count += 1;
        }
      });
      if (count === 0) {
        return undefined;
      }
      return convertQuestionValueToPercentage(qs, q.id, sum / count);
    };

    const barData = getQuestions(qs).reduce<any>((bcd, q) => {
      const qMeanROC = aggregateQuestionROC(q);
      if (qMeanROC !== undefined) {
        bcd.data.push(qMeanROC);
        bcd.labels.push(getQuestionFriendlyName(q.id, qs));
      }
      return bcd;
    }, {
      data: [],
      labels: [],
    });

    return {
      labels: barData.labels,
      series: [{
        label: 'Average Rate of Change',
        data: barData.data,
      }],
    };
  }

  private getBarData(p: IProp): BarChartData {
    const beneficiaryData = p.report.beneficiaries;
    if (p.category) {
      return this.getCategoryBarData(beneficiaryData, p.questionSet);
    }
    return this.getQuestionBarData(beneficiaryData, p.questionSet);
  }

  private renderBar(p: IProp): JSX.Element {
    if (p.report.beneficiaries.length === 0) {
      return (<div />);
    }
    const data = this.getBarData(p);
    return (
      <BarChart data={data} xAxisLabel={'Average Rate of Change'} valueSuffixLabel={'%'} />
    );
  }

  public render() {
    return (
      <div className="roc-report-bar">
        {this.renderBar(this.props)}
      </div>
    );
  }
}

export {RocReportBarChart};
