import {gql, graphql, QueryProps, QueryOpts} from 'react-apollo';
import {
  answerAggregationFragment, IAnswerAggregationReport,
  beneficiaryAggregationFragment, IBeneficiaryAggregationReport,
} from 'models/report';
import {Extractor, IDExtractor} from 'helpers/apollo';
import {isNullOrUndefined} from 'util';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>, open?: Extractor<T, boolean>, orTags?: Extractor<T, boolean>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String], $open: Boolean, $orTags: Boolean) {
      getJOCServiceReport: report(start:$start, end: $end, questionnaire: $questionSetID, tags: $tags, openStart: $open, orTags: $orTags) {
        ...answerAggregationFragment
      }
    }
    ${answerAggregationFragment}`,
  {
    name: 'JOCServiceReport',
    options: (props: T): QueryOpts => {
      let openStart = true;
      if (!isNullOrUndefined(open)) {
        openStart = open(props);
      }
      return {
        variables: {
          questionSetID: qid(props),
          start: start(props),
          end: end(props),
          tags: tags(props),
          open: openStart,
          orTags: orTags ? orTags(props) : false,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
      };
    },
  });
};

export const getROCReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>) => {
  return graphql<any, T>(gql`
    query ROCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String]) {
      getROCReport: report(start:$start, end: $end, questionnaire: $questionSetID, tags: $tags, openStart: false) {
        ...beneficiaryAggregationFragment
      }
    }
    ${beneficiaryAggregationFragment}`,
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
          notifyOnNetworkStatusChange: true,
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
  getROCReport?: IBeneficiaryAggregationReport;
}

export interface IROCReportResult {
  ROCReport?: IROCResult;
}

export const exportReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>, openStart: Extractor<T, boolean>, orTags?: Extractor<T, boolean>) => {
  return graphql<any, T>(gql`
    query ($start: String!, $end: String!, $questionSetID: String!, $tags:[String], $openStart: Boolean, $orTags: Boolean) {
      exportReport: exportReport(
        questionnaire: $questionSetID,
  	    start: $start,
  	    end: $end,
        tags: $tags,
        openStart: $openStart,
        orTags: $orTags
      )
    }`, {
    options: (props: T) => {
      return {
        variables: {
          questionSetID: qid(props),
          start: start(props),
          end: end(props),
          tags: tags(props),
          openStart: openStart(props),
          orTags: orTags ? orTags(props) : false,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
      };
    },
  });
};

export interface IExportReportResult extends QueryProps {
  exportReport?: string;
}
