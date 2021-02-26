import * as React from 'react';
import {IAnswerAggregation, IAnswerAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ImpactTable, IRow} from 'components/ImpactTable';
import {useTranslation} from 'react-i18next';
import {getCategoryFriendlyName, getQuestionFriendlyName} from 'helpers/questionnaire';

interface IProp {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

function getRowData(aa: IAnswerAggregation[], labeller: (IAnswerAggregation) => string): IRow[] {
  return aa.map((a): IRow => {
    return {
      name: labeller(a),
      last: a.latest,
      first: a.initial,
    };
  });
}

function getCategoryRows(p: IProp): IRow[] {
  const categoryLabeller = (aa: IAnswerAggregation): string => {
    return getCategoryFriendlyName(aa.id, p.questionSet);
  };
  return getRowData(p.serviceReport.categories, categoryLabeller);
}

function getQuestionRows(p: IProp): IRow[] {
  const qLabeller = (aa: IAnswerAggregation): string => {
    return getQuestionFriendlyName(aa.id, p.questionSet);
  };
  return getRowData(p.serviceReport.questions, qLabeller);
}

function renderTable(t: (text: string) => string, p: IProp): JSX.Element {
  const rows = p.category ? getCategoryRows(p) : getQuestionRows(p);
  if (rows.length === 0) {
    return (<div/>);
  }
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ImpactTable
      data={rows}
      nameColName={p.category ? t('Category') : t('Question')}
    />
  );
}

export const ServiceReportTable = (p: IProp): JSX.Element => {
  const {t} = useTranslation();
  return (
    <div className="service-report-table">
      {renderTable(t, p)}
    </div>
  );
}
