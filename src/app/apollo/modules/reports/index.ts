import {gql, graphql, QueryProps, QueryOpts} from 'react-apollo';
import {
  answerAggregationFragment, IAnswerAggregationReport,
} from 'models/report';
import {Extractor, IDExtractor} from 'helpers/apollo';
import {isNullOrUndefined} from 'util';

export const getJOCServiceReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>, open?: Extractor<T, boolean>, orTags?: Extractor<T, boolean>, minRequiredRecords?: Extractor<T, number>) => {
  return graphql<any, T>(gql`
    query JOCServiceReport($start: String!, $end: String!, $questionSetID: String!, $tags:[String], $open: Boolean, $orTags: Boolean, $minRequiredRecords: Int) {
      getJOCServiceReport: report(start:$start, end: $end, questionnaire: $questionSetID, tags: $tags, openStart: $open, orTags: $orTags, minRequiredRecords: $minRequiredRecords) {
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
          minRequiredRecords: minRequiredRecords ? minRequiredRecords(props) : undefined,
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

export const exportReport = <T>(qid: IDExtractor<T>, start: IDExtractor<T>, end: IDExtractor<T>, tags: Extractor<T, string[]>, openStart: Extractor<T, boolean>, orTags?: Extractor<T, boolean>, minRequiredRecords?: Extractor<T, number>) => {
  return graphql<any, T>(gql`
    query ($start: String!, $end: String!, $questionSetID: String!, $tags:[String], $openStart: Boolean, $orTags: Boolean, $minRequiredRecords: Int) {
      exportReport: exportReport(
        questionnaire: $questionSetID,
  	    start: $start,
  	    end: $end,
        tags: $tags,
        openStart: $openStart,
        orTags: $orTags,
        minRequiredRecords: $minRequiredRecords
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
          minRequiredRecords: minRequiredRecords ? minRequiredRecords(props) : undefined,
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
