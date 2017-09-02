import {gql, graphql, QueryProps} from 'react-apollo';
import {IJOCServiceReport, fragment} from 'models/report';
import {IDExtractor} from 'helpers/apollo';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!) {
      getJOCServiceReport: JOCServiceReport(start:$start, end: $end, questionSetID: $questionSetID) {
        ...defaultJOCReport
      }
    }
    ${fragment}`,
  {
    options: (props: T) => {
      return {
        variables: {
          questionSetID: qid(props),
          start: start(props),
          end: end(props),
        },
      };
    },
  });
};

export interface IReportResult extends QueryProps {
    getJOCServiceReport?: IJOCServiceReport;
}
