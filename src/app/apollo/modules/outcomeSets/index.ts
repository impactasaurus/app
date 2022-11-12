import { gql, graphql, QueryProps } from "react-apollo";
import { IOutcomeSet, fragment } from "models/outcomeSet";
import { IDExtractor, mutationResultExtractor } from "helpers/apollo";
import { IWithNotes } from "models/question";

export const getOutcomeSet = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(
    gql`
      query getOutcomeSet($id: String!) {
        getOutcomeSet: outcomeset(id: $id) {
          ...defaultOutcomeSet
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

export const allOutcomeSetsGQL = gql`
  query allOutcomeSets {
    allOutcomeSets: outcomesets {
      ...defaultOutcomeSet
    }
  }
  ${fragment}
`;

export function allOutcomeSets<T>(component, name?: string) {
  return graphql<any, T>(allOutcomeSetsGQL, {
    options: {
      notifyOnNetworkStatusChange: true,
    },
    name,
  })(component);
}

export const newQuestionSet = graphql(
  gql`
    mutation ($name: String!, $description: String) {
      newQuestionSet: AddOutcomeSet(name: $name, description: $description) {
        ...defaultOutcomeSet
      }
    }
    ${fragment}
  `,
  {
    options: {
      refetchQueries: ["allOutcomeSets"],
    },
    props: ({ mutate }) => ({
      newQuestionSet: (
        name: string,
        description?: string
      ): Promise<IOutcomeSet> =>
        mutate({
          variables: {
            name,
            description,
          },
        }).then(mutationResultExtractor<IOutcomeSet>("newQuestionSet")),
    }),
  }
);

export function editQuestionSet<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $id: ID!
        $name: String!
        $description: String
        $instructions: String
        $noteRequired: Boolean
        $notePrompt: String
        $noteDeactivated: Boolean
      ) {
        editQuestionSet: EditOutcomeSet(
          outcomeSetID: $id
          name: $name
          description: $description
          instructions: $instructions
          noteRequired: $noteRequired
          notePrompt: $notePrompt
          noteDeactivated: $noteDeactivated
        ) {
          ...defaultOutcomeSet
        }
      }
      ${fragment}
    `,
    {
      props: ({ mutate }) => ({
        editQuestionSet: (
          id: string,
          name: string,
          description: string,
          instructions: string,
          noteOptions?: IWithNotes
        ): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              id,
              name,
              description,
              instructions,
              ...noteOptions,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("editQuestionSet")),
      }),
    }
  )(component);
}

export const deleteQuestionSet = <T>(component) => {
  return graphql<any, T>(
    gql`
      mutation ($id: ID!) {
        deleteQuestionSet: DeleteOutcomeSet(outcomeSetID: $id)
      }
    `,
    {
      options: {
        refetchQueries: ["allOutcomeSets"],
      },
      props: ({ mutate }) => ({
        deleteQuestionSet: (id: string): Promise<string> =>
          mutate({
            variables: {
              id,
            },
          }).then(mutationResultExtractor<string>("deleteQuestionSet")),
      }),
    }
  )(component);
};

export interface IOutcomeResult extends QueryProps {
  allOutcomeSets?: IOutcomeSet[];
  getOutcomeSet?: IOutcomeSet;
}

export interface IOutcomeMutation {
  newQuestionSet?(name: string, description?: string): Promise<IOutcomeSet>;
  deleteQuestionSet?(id: string): Promise<string>;
  editQuestionSet?(
    id: string,
    name: string,
    description: string,
    instructions: string,
    noteOptions?: IWithNotes
  ): Promise<IOutcomeSet>;
}
