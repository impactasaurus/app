import { gql, graphql, QueryProps, QueryOpts } from "react-apollo";
import {
  answerAggregationFragment,
  IAnswerAggregationReport,
  reportFragment,
  IReport,
} from "models/report";
import { Extractor, IDExtractor } from "helpers/apollo";
import { isNullOrUndefined } from "util";
import { IReportOptions } from "containers/Report/helpers";

export const getJOCServiceReport = <T>(
  qid: IDExtractor<T>,
  start: IDExtractor<T>,
  end: IDExtractor<T>,
  tags: Extractor<T, string[]>,
  open?: Extractor<T, boolean>,
  orTags?: Extractor<T, boolean>
) => {
  return graphql<any, T>(
    gql`
      query JOCServiceReport(
        $start: String!
        $end: String!
        $questionSetID: String!
        $tags: [String]
        $open: Boolean
        $orTags: Boolean
      ) {
        getJOCServiceReport: report(
          start: $start
          end: $end
          questionnaire: $questionSetID
          tags: $tags
          openStart: $open
          orTags: $orTags
        ) {
          ...answerAggregationFragment
        }
      }
      ${answerAggregationFragment}
    `,
    {
      name: "JOCServiceReport",
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
          fetchPolicy: "network-only",
        };
      },
    }
  );
};

export interface IJOCResult extends QueryProps {
  getJOCServiceReport?: IAnswerAggregationReport;
}

export interface IJOCReportResult {
  JOCServiceReport?: IJOCResult;
}

export const exportReport = <T>(opts: Extractor<T, IReportOptions>) => {
  return graphql<any, T>(
    gql`
      query (
        $start: String!
        $end: String!
        $questionnaire: String!
        $tags: [String]
        $orTags: Boolean
        $minRecords: Int
        $openStart: Boolean
      ) {
        exportReport: exportReport(
          questionnaire: $questionnaire
          start: $start
          end: $end
          tags: $tags
          openStart: $openStart
          orTags: $orTags
          minRequiredRecords: $minRecords
        )
      }
    `,
    {
      options: (props: T) => {
        return {
          variables: opts(props),
          notifyOnNetworkStatusChange: true,
          fetchPolicy: "network-only",
        };
      },
    }
  );
};

export interface IExportReportResult extends QueryProps {
  exportReport?: string;
}

export const getReport = <T>(
  opts: Extractor<T, IReportOptions>,
  name?: string
) => {
  return graphql<any, T>(
    gql`
      query statusReport(
        $start: String!
        $end: String!
        $questionnaire: String!
        $tags: [String]
        $orTags: Boolean
        $minRecords: Int
        $openStart: Boolean
      ) {
        getReport: report(
          questionnaire: $questionnaire
          start: $start
          end: $end
          tags: $tags
          openStart: $openStart
          orTags: $orTags
          minRequiredRecords: $minRecords
        ) {
          ...reportFragment
        }
      }
      ${reportFragment}
    `,
    {
      name,
      options: (props: T): QueryOpts => {
        return {
          variables: opts(props),
          notifyOnNetworkStatusChange: true,
          fetchPolicy: "network-only",
        };
      },
    }
  );
};

export interface IReportResponse extends QueryProps {
  getReport?: IReport;
}
