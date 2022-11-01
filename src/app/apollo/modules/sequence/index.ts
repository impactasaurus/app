import { ISequenceCRUD } from "components/SequenceForm";
import { IDExtractor, mutationResultExtractor } from "helpers/apollo";
import { IAssessmentConfig } from "models/assessment";
import { fragment, ISequence } from "models/sequence";
import { gql, graphql, QueryProps } from "react-apollo";
import { getAllMeetingsGQL, getMeetingsGQL } from "../meetings";

const getSequencesGQL = gql`
  query allSequences {
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

export function newSequence<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $name: String!
        $description: String
        $destination: String
        $questionnaires: [String]!
      ) {
        newSequence: NewSequence(
          name: $name
          description: $description
          destination: $destination
          questionnaires: $questionnaires
        ) {
          ...defaultSequence
        }
      }
      ${fragment}
    `,
    {
      options: {
        refetchQueries: ["allSequences"],
      },
      props: ({ mutate }) => ({
        newSequence: (p: ISequenceCRUD): Promise<ISequence> =>
          mutate({
            variables: p,
          }).then(mutationResultExtractor<ISequence>("newSequence")),
      }),
    }
  )(component);
}

export interface INewSequence {
  newSequence: (p: ISequenceCRUD) => Promise<ISequence>;
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
        $conducted: String
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
              conducted: config?.date?.toISOString(),
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

export function startRemoteSequence<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $beneficiaryID: String!
        $sequenceID: String!
        $daysToComplete: Int!
        $tags: [String]
      ) {
        startRemoteSequence: StartRemoteSequence(
          beneficiaryID: $beneficiaryID
          sequenceID: $sequenceID
          daysToComplete: $daysToComplete
          tags: $tags
        )
      }
    `,
    {
      props: ({ mutate }) => ({
        startRemoteSequence: (
          config: IAssessmentConfig,
          daysToComplete: number
        ): Promise<string> =>
          mutate({
            variables: {
              beneficiaryID: config.beneficiaryID,
              sequenceID: config.qishID,
              daysToComplete: Math.ceil(daysToComplete),
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
          }).then(mutationResultExtractor<string>("startRemoteSequence")),
      }),
    }
  )(component);
}

export interface IStartRemoteSequence {
  startRemoteSequence: (
    config: IAssessmentConfig,
    daysToComplete: number
  ) => Promise<string>;
}

export const deleteSequence = <T>(component) => {
  return graphql<any, T>(
    gql`
      mutation ($id: String!) {
        deleteSequence: DeleteSequence(id: $id)
      }
    `,
    {
      options: {
        refetchQueries: ["allSequences"],
      },
      props: ({ mutate }) => ({
        deleteSequence: (id: string): Promise<void> =>
          mutate({
            variables: {
              id,
            },
          }).then(),
      }),
    }
  )(component);
};

export interface IDeleteSequence {
  deleteSequence: (id: string) => Promise<void>;
}

export function editSequence<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $id: String!
        $name: String!
        $description: String
        $destination: String
        $questionnaires: [String]!
      ) {
        editSequence: EditSequence(
          id: $id
          name: $name
          description: $description
          destination: $destination
          questionnaires: $questionnaires
        ) {
          ...defaultSequence
        }
      }
      ${fragment}
    `,
    {
      props: ({ mutate }) => ({
        editSequence: (id: string, p: ISequenceCRUD): Promise<ISequence> =>
          mutate({
            variables: {
              ...p,
              id,
            },
          }).then(mutationResultExtractor<ISequence>("editSequence")),
      }),
    }
  )(component);
}

export interface IEditSequence {
  editSequence: (id: string, p: ISequenceCRUD) => Promise<ISequence>;
}
