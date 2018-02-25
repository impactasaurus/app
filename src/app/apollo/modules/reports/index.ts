import {gql, graphql, QueryProps, QueryOpts} from 'react-apollo';
import {IJOCServiceReport, jocFragment, IROCReport, rocFragment} from 'models/report';
import {Extractor, IDExtractor} from 'helpers/apollo';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String]) {
      getJOCServiceReport: JOCServiceReport(start:$start, end: $end, questionSetID: $questionSetID, tags: $tags) {
        ...defaultJOCReport
      }
    }
    ${jocFragment}`,
  {
    name: 'JOCServiceReport',
    options: (props: T): QueryOpts => {
      return {
        variables: {
          questionSetID: qid(props),
          start: start(props),
          end: end(props),
          tags: tags(props),
        },
        fetchPolicy: 'network-only',
      };
    },
  });
};

export const getROCReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>) => {
  return graphql<any, T>(gql`
    query ROCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String]) {
      getROCReport: ROCReport(start:$start, end: $end, questionSetID: $questionSetID, tags: $tags) {
        ...defaultROCReport
      }
    }
    ${rocFragment}`,
    {
      name: 'ROCReport',
      options: (props: T): QueryOpts => {
        return {
          variables: {
            questionSetID: qid(props),
            start: start(props),
            end: end(props),
            tags: tags(props),
          },
          fetchPolicy: 'network-only',
        };
      },
    });
};

export interface IJOCResult extends QueryProps {
  getJOCServiceReport?: IJOCServiceReport;
}

export interface IJOCReportResult {
  JOCServiceReport: IJOCResult;
}

export interface IROCResult extends QueryProps {
  getROCReport?: IROCReport;
}

export interface IROCReportResult {
  ROCReport?: IROCResult;
}
