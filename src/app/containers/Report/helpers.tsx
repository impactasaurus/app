import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {IURLConnector} from 'redux/modules/url';
import {Message} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import * as React from 'react';
import {IExclusion} from 'models/report';

export interface IReportProps {
  match: {
    params: {
      questionSetID: string,
      start: string,
      end: string,
    },
  };
  location: {
    search: string,
  };
}

export const getQuestionSetIDFromProps = (p: IReportProps): string => p.match.params.questionSetID;
export const getStartDateFromProps = (p: IReportProps): string => p.match.params.start;
export const getEndDateFromProps = (p: IReportProps): string => p.match.params.end;

export const getTagsFromProps = (p: IReportProps): string[] => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('tags') === false) {
    return [];
  }
  const tags = urlParams.get('tags');
  return JSON.parse(tags);
};

export const getOpenStartFromProps = (p: IReportProps): boolean => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('open') === false) {
    return true;
  }
  return JSON.parse(urlParams.get('open'));
};

export const getOrFromProps = (p: IReportProps): boolean => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('or') === false) {
    return false;
  }
  return JSON.parse(urlParams.get('or'));
};

export const exportReportData = (urlConn: IURLConnector, p: IReportProps) => {
  const {start, end, questionSetID} = p.match.params;
  const url = constructReportURL('export', new Date(start), new Date(end), questionSetID);
  const qp = constructReportQueryParams(getTagsFromProps(p), getOpenStartFromProps(p), getOrFromProps(p));
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
