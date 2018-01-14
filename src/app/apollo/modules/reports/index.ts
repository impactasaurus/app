import {gql, graphql, QueryProps, QueryOpts} from 'react-apollo';
import {IJOCServiceReport, fragment} from 'models/report';
import {Extractor, IDExtractor} from 'helpers/apollo';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String]) {
      getJOCServiceReport: JOCServiceReport(start:$start, end: $end, questionSetID: $questionSetID, tags: $tags) {
        ...defaultJOCReport
      }
    }
    ${fragment}`,
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

export interface IJOCResult extends QueryProps {
    getJOCServiceReport?: IJOCServiceReport;
}

export interface IReportResult {
  JOCServiceReport: IJOCResult;
}
