import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {IURLConnector} from 'redux/modules/url';
import {Message} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import * as React from 'react';
import {IExclusion} from 'models/report';

export interface IReportOptions {
  start: Date;
  end: Date;
  questionnaire: string;
  tags: string[];
  openStart: boolean;
  orTags: boolean;
}

export const exportReportData = (urlConn: IURLConnector, p: IReportOptions) => {
  const url = constructReportURL('export', p.start, p.end, p.questionnaire);
  const qp = constructReportQueryParams(p.tags, p.openStart, p.orTags);
  urlConn.setURL(url, qp);
};

export const renderEmptyReport = (ie: IExclusion[]): JSX.Element => {
  const unqiueExcludedBens = ie
    .filter((e) => e.beneficiary !== undefined)
    .filter((e, i, a) => a.indexOf(e) === i);
  if (unqiueExcludedBens.length > 0) {
    return (
      <Message warning={true}>
        <Message.Header>We Need More Records</Message.Header>
        <p>When generating your report, we only found beneficiaries with one record</p>
        <p>We need <b>at least two records</b> to understand the impact your intervention is having on a beneficiary</p>
        <p>Please collect more records and ensure that the time range you provided includes them</p>
      </Message>
    );
  }
  return (
    <Message warning={true}>
      <Message.Header>No Records</Message.Header>
      <div>
        <p>We couldn't generate your report as we found no records. This may be because:</p>
        <p>There are no records in the system, <Link to={'/record'}>click here to create some</Link></p>
        <p>or</p>
        <p>The report's time range didn't contain any records</p>
      </div>
    </Message>
  );
};
