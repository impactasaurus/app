import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {IURLConnector} from 'redux/modules/url';

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
  const parsedTags = JSON.parse(tags);
  return parsedTags;
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
