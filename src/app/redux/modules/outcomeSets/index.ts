import {gql, graphql, QueryProps} from 'react-apollo';
import {IOutcomeSet, fragment} from 'models/outcomeSet';
import {IDExtractor} from 'helpers/apollo';

export const getOutcomeSet = <T>(idExtractor: IDExtractor<T>): any => {
  return graphql<T>(gql`
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
      newQuestionSet: (name: string, description?: string) => mutate({
          variables: {
              name,
              description,
          },
      }),
    }),
  });

export const editQuestionSet = graphql(gql`
  mutation ($id: ID!, $name: String!, $description: String) {
    editQuestionSet: EditOutcomeSet(outcomeSetID:$id, name:$name, description:$description) {
      ...defaultOutcomeSet
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      editQuestionSet: (id: string, name: string, description?: string) => mutate({
          variables: {
              id,
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
    getOutcomeSet?: IOutcomeSet;
    editQuestionSet?: IOutcomeSet;
}

export interface IOutcomeMutation {
    newQuestionSet(name: string, description?: string);
    deleteQuestionSet(id: string);
    editQuestionSet(id: string, name: string, description?: string);
}
