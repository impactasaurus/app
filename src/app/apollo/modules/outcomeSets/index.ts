import { gql, graphql, QueryProps } from "react-apollo";
import { IOutcomeSet, IRequiredTag, fragment } from "models/outcomeSet";
import { IDExtractor, mutationResultExtractor } from "helpers/apollo";
import { IWithNotes } from "models/question";

// cleanRequiredTagArray defends against __typename attributes
export const cleanRequiredTagArray = (rts: IRequiredTag[]): IRequiredTag[] => {
  return rts.map<IRequiredTag>((rt) => ({
    label: rt.label,
    options: rt.options,
  }));
};

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
        $requiredTags: [RequiredTagInput]
      ) {
        editQuestionSet: EditOutcomeSet(
          outcomeSetID: $id
          name: $name
          description: $description
          instructions: $instructions
          noteRequired: $noteRequired
          notePrompt: $notePrompt
          noteDeactivated: $noteDeactivated
          requiredTags: $requiredTags
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
          noteOptions?: IWithNotes,
          requiredTags?: IRequiredTag[]
        ): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              id,
              name,
              description,
              instructions,
              ...noteOptions,
              requiredTags: cleanRequiredTagArray(requiredTags),
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
    noteOptions?: IWithNotes,
    requiredTags?: IRequiredTag[]
  ): Promise<IOutcomeSet>;
}
