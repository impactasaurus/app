import {gql, graphql, QueryProps} from 'react-apollo';
import {IOutcomeSet} from 'models/outcomeSet';

export const allOutcomeSets = graphql(gql`
query allOutcomeSets {
  allOutcomeSets: outcomesets{
    name,
    description,
    id,
    questions {
      id
    }
  }
}`);

export const newQuestionSet = graphql(gql`
mutation ($name: String!, $description: String) {
  newQuestionSet: AddOutcomeSet(name:$name, description:$description) {
    name,
    description,
    id,
    questions {
      id
    }
  }
}
`, {
  options: {
    refetchQueries: ['allOutcomeSets'],
  } as any,
  props: ({ mutate }) => ({
    newQuestionSet: (name: string, description?: string) => mutate({
        variables: {
            name,
            description,
        },
    }),
  }),
});

export const deleteQuestionSet = graphql(gql`
mutation ($id: ID!) {
  deleteQuestionSet: DeleteOutcomeSet(outcomeSetID:$id)
}
`, {
  options: {
    refetchQueries: ['allOutcomeSets'],
  } as any,
  props: ({ mutate }) => ({
    deleteQuestionSet: (id: string) => mutate({
        variables: {
            id,
        },
    }),
  }),
});

export interface IOutcomeResult extends QueryProps {
    allOutcomeSets?: IOutcomeSet[];
    newQuestionSet?: IOutcomeSet;
}

export interface IOutcomeMutation {
    newQuestionSet(name: string, description?: string);
    deleteQuestionSet(id: string);
}
