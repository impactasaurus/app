import {gql, graphql, QueryProps, QueryOpts} from 'react-apollo';
import {IROCReport, rocFragment, answerAggregationFragment, IAnswerAggregationReport} from 'models/report';
import {Extractor, IDExtractor} from 'helpers/apollo';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String]) {
      getJOCServiceReport: report(start:$start, end: $end, questionnaire: $questionSetID, tags: $tags, openStart: true) {
        ...answerAggregationFragment
      }
    }
    ${answerAggregationFragment}`,
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
  getJOCServiceReport?: IAnswerAggregationReport;
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
