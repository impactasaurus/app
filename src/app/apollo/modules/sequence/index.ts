import { IDExtractor, mutationResultExtractor } from "helpers/apollo";
import { IAssessmentConfig } from "models/assessment";
import { fragment, ISequence } from "models/sequence";
import { gql, graphql, QueryProps } from "react-apollo";
import { getAllMeetingsGQL, getMeetingsGQL } from "../meetings";

const getSequencesGQL = gql`
  query {
    sequences {
      ...defaultSequence
    }
  }
  ${fragment}
`;

export const getSequences = <T>(component, name: string = undefined) => {
  return graphql<any, T>(getSequencesGQL, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
      };
    },
    name,
  })(component);
};

export interface IGetSequences extends QueryProps {
  sequences?: ISequence[];
}

export const getSequence = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(
    gql`
      query getSequence($id: String!) {
        sequence(id: $id) {
          ...defaultSequence
        }
      }
      ${fragment}
    `,
    {
      options: (props: T) => {
        return {
          variables: {
            id: idExtractor(props),
          },
        };
      },
    }
  );
};

export interface IGetSequence extends QueryProps {
  sequence?: ISequence;
}

export interface IStartSequenceResult {
  meetings: {
    id: string;
  }[];
  destination?: string;
}

export function startSequence<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $beneficiaryID: String!
        $sequenceID: String!
        $conducted: String!
        $tags: [String]
      ) {
        startSequence: StartSequence(
          beneficiaryID: $beneficiaryID
          sequenceID: $sequenceID
          conducted: $conducted
          tags: $tags
        ) {
          meetings {
            id
          }
          destination
        }
      }
    `,
    {
      props: ({ mutate }) => ({
        startSequence: (
          config: IAssessmentConfig
        ): Promise<IStartSequenceResult> =>
          mutate({
            variables: {
              beneficiaryID: config.beneficiaryID,
              sequenceID: config.qishID,
              conducted: config.date
                ? config.date.toISOString()
                : new Date().toISOString(),
              tags: config.tags || [],
            },
            refetchQueries: [
              {
                query: getMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
              {
                query: getAllMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
            ],
          }).then(
            mutationResultExtractor<IStartSequenceResult>("startSequence")
          ),
      }),
    }
  )(component);
}

export interface IStartSequence {
  startSequence: (config: IAssessmentConfig) => Promise<IStartSequenceResult>;
}
