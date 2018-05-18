import * as React from 'react';
import {IJOCServiceReport, IQuestionAggregates, ICategoryAggregates} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {RadarChart} from 'components/RadarChart';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {getMinQuestionValue, getMaxQuestionValue, getMinCategoryValue, getMaxCategoryValue} from 'helpers/questionnaire';

interface IProp {
  serviceReport: IJOCServiceReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

class ServiceReportRadar extends React.Component<IProp, any> {

  private getCategoryRadarData(p: IProp): RadarData {
    const getCatRadarSeries = (c: ICategoryAggregates[], name: string): IRadarSeries => {
      return {
        name,
        datapoints: c.map((point: ICategoryAggregates): IRadarPoint => {
          let category = 'Unknown Category';
          const cat = p.questionSet.categories.find((c) => c.id === point.categoryID);
          if (cat !== undefined) {
            category = cat.name;
          }
          return {
            axis: category,
            value: point.value,
          };
        }),
      };
    };
    return {
      series: [getCatRadarSeries(p.serviceReport.categoryAggregates.first, 'initial'), getCatRadarSeries(p.serviceReport.categoryAggregates.last, 'latest')],
      scaleMin: getMinCategoryValue(p.questionSet),
      scaleMax: getMaxCategoryValue(p.questionSet),
    };
  }

  private getQuestionRadarData(p: IProp): RadarData {
    const getQRadarSeries = (c: IQuestionAggregates[], name: string): IRadarSeries => {
      return {
        name,
        datapoints: c.map((point: IQuestionAggregates): IRadarPoint => {
          const q = p.questionSet.questions.find((q) => q.id === point.questionID);
          let question = 'Unknown Question';
          if (q !== undefined) {
            question = (q.short || q.question);
            if (q.archived) {
              question = `${question} (archived)`;
            }
          }
          return {
            axis: question,
            value: point.value,
          };
        }),
      };
    };
    return {
      series: [getQRadarSeries(p.serviceReport.questionAggregates.first, 'Initial'), getQRadarSeries(p.serviceReport.questionAggregates.last, 'Latest')],
      scaleMin: getMinQuestionValue(p.questionSet),
      scaleMax: getMaxQuestionValue(p.questionSet),
    };
  }

  private getRadarData(p: IProp): RadarData {
    if (p.category) {
      return this.getCategoryRadarData(p);
    }
    return this.getQuestionRadarData(p);
  }

  private renderRadar(p: IProp): JSX.Element {
    if (p.serviceReport.beneficiaryIDs.length === 0) {
      return (<div />);
    }
    const data = this.getRadarData(p);
    return (
      <RadarChart data={data} />
    );
  }

  public render() {
    return (
      <div className="service-report-radar">
        {this.renderRadar(this.props)}
      </div>
    );
  }
}

export {ServiceReportRadar}
