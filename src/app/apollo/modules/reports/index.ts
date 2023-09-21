import { gql, graphql, QueryProps, QueryOpts } from "react-apollo";
import { reportFragment, IReport } from "models/report";
import { Extractor } from "helpers/apollo";
import { IReportOptions } from "containers/Report/helpers";

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
