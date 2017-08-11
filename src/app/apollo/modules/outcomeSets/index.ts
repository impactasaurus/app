import {gql, graphql, QueryProps} from 'react-apollo';
import {IOutcomeSet, fragment} from 'models/outcomeSet';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';

export const getOutcomeSet = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query getOutcomeSet($id: String!) {
      getOutcomeSet: outcomeset(id:$id) {
        ...defaultOutcomeSet
      }
    }
    ${fragment}`,
  {
    options: (props: T) => {
      return {
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

export const allOutcomeSets = graphql(gql`
  query allOutcomeSets {
    allOutcomeSets: outcomesets{
      ...defaultOutcomeSet
    }
  }
  ${fragment}`);

export const newQuestionSet = graphql(gql`
  mutation ($name: String!, $description: String) {
    newQuestionSet: AddOutcomeSet(name:$name, description:$description) {
      ...defaultOutcomeSet
    }
  }
  ${fragment}`, {
    options: {
      refetchQueries: ['allOutcomeSets'],
    } as any,
    props: ({ mutate }) => ({
      newQuestionSet: (name: string, description?: string): Promise<IOutcomeSet> => mutate({
          variables: {
              name,
              description,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('newQuestionSet')),
    }),
  });

export function editQuestionSet<T>(component) {
  return graphql<any, T>(gql`
  mutation ($id: ID!, $name: String!, $description: String) {
    editQuestionSet: EditOutcomeSet(outcomeSetID:$id, name:$name, description:$description) {
      ...defaultOutcomeSet
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      editQuestionSet: (id: string, name: string, description?: string): Promise<IOutcomeSet> => mutate({
          variables: {
              id,
              name,
              description,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('editQuestionSet')),
    }),
  })(component);
}

export const deleteQuestionSet = graphql(gql`
  mutation ($id: ID!) {
    deleteQuestionSet: DeleteOutcomeSet(outcomeSetID:$id)
  }
  `, {
    options: {
      refetchQueries: ['allOutcomeSets'],
    } as any,
    props: ({ mutate }) => ({
      deleteQuestionSet: (id: string): Promise<string> => mutate({
          variables: {
              id,
          },
      }).then(mutationResultExtractor<string>('deleteQuestionSet')),
    }),
  });

export interface IOutcomeResult extends QueryProps {
    allOutcomeSets?: IOutcomeSet[];
    getOutcomeSet?: IOutcomeSet;
}

export interface IOutcomeMutation {
    newQuestionSet(name: string, description?: string): Promise<IOutcomeSet>;
    deleteQuestionSet(id: string): Promise<string>;
    editQuestionSet(id: string, name: string, description?: string): Promise<IOutcomeSet>;
}
