import * as React from 'react';
import {IBeneficiaryROC, ICategoryROC, IQuestionROC, IROCReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {BarChartData} from 'models/bar';
import {BarChart} from 'components/BarChart';
import {IQuestion} from 'models/question';
import {ICategory} from 'models/category';

interface IProp {
  report: IROCReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

class RocReportBarChart extends React.Component<IProp, any> {

  private getCategoryBarData(p: IProp): BarChartData {
    const getCategoryForBeneficiary = (cID: string, bd: IBeneficiaryROC): ICategoryROC|undefined => {
      return bd.categoryROCs.find((cRoc) => cRoc.categoryID === cID);
    };

    const aggregateCategoryROC = (c: ICategory): number|null => {
      let sum = 0, count = 0;
      p.report.beneficiaries.forEach((b) => {
        const benCatRoc = getCategoryForBeneficiary(c.id, b);
        if (benCatRoc !== undefined) {
          sum += benCatRoc.value;
          count += 1;
        }
      });
      if (count === 0) {
        return null;
      }
      return sum / count;
    };

    const barData = p.questionSet.categories.reduce<any>((bcd, c) => {
      const qMeanROC = aggregateCategoryROC(c);
      if (qMeanROC !== null) {
        bcd.data.push(qMeanROC);
        bcd.labels.push(c.name);
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

  private getQuestionBarData(p: IProp): BarChartData {
    const getQuestionForBeneficiary = (qID: string, bd: IBeneficiaryROC): IQuestionROC|undefined => {
      return bd.questionROCs.find((qRoc) => qRoc.questionID === qID);
    };

    const aggregateQuestionROC = (q: IQuestion): number|null => {
      let sum = 0, count = 0;
      p.report.beneficiaries.forEach((b) => {
        const benQRoc = getQuestionForBeneficiary(q.id, b);
        if (benQRoc !== undefined) {
          sum += benQRoc.value;
          count += 1;
        }
      });
      if (count === 0) {
        return null;
      }
      return sum / count;
    };

    const barData = p.questionSet.questions.reduce<any>((bcd, q) => {
      const qMeanROC = aggregateQuestionROC(q);
      if (qMeanROC !== null) {
        bcd.data.push(qMeanROC);
        bcd.labels.push(q.question);
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
    if (p.category) {
      return this.getCategoryBarData(p);
    }
    return this.getQuestionBarData(p);
  }

  private renderBar(p: IProp): JSX.Element {
    if (p.report.beneficiaries.length === 0) {
      return (<div />);
    }
    const data = this.getBarData(p);
    return (
      <BarChart data={data} />
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

export {RocReportBarChart}