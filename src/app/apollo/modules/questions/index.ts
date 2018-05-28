import {gql, graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';
import {ILabel} from 'models/question';

// cleanLabelArray defends against __typename attributes
const cleanLabelArray = (labels: ILabel[]): ILabel[] => {
  return labels.map<ILabel>((l: ILabel): ILabel => ({
    label: l.label,
    value: l.value,
  }));
};

export function addLikertQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $question: String!, $description: String, $minValue: Int, $maxValue: Int!, $labels: [LabelInput], $categoryID: String) {
    addLikertQuestion: AddLikertQuestion(outcomeSetID:$outcomeSetID, question: $question, description: $description, minValue: $minValue, maxValue: $maxValue, labels: $labels, categoryID: $categoryID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addLikertQuestion: (outcomeSetID: string, question: string, minValue: number, maxValue: number, description?: string, categoryID?: string, labels?: ILabel[]): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            question,
            description,
            minValue,
            maxValue,
            labels: cleanLabelArray(labels),
            categoryID,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('addLikertQuestion')),
    }),
  })(component);
}

export function editLikertQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $questionID: ID!, $question: String!, $description: String, $labels: [LabelInput]) {
    editLikertQuestion: EditLikertQuestion(outcomeSetID:$outcomeSetID, questionID: $questionID, question: $question, description: $description, labels: $labels) {
      ...defaultOutcomeSet
    },
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      editLikertQuestion: (outcomeSetID: string, questionID: string, question: string, description?: string, labels?: ILabel[]): Promise<IOutcomeSet> => mutate({
        variables: {
          outcomeSetID,
          questionID,
          question,
          description,
          labels: cleanLabelArray(labels),
        },
      }).then(mutationResultExtractor<IOutcomeSet>('editLikertQuestion')),
    }),
  })(component);
}

export function deleteQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: String!, $questionID: String!) {
    deleteQuestion: DeleteQuestion(outcomeSetID:$outcomeSetID, questionID: $questionID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      deleteQuestion: (outcomeSetID: string, questionID: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            questionID,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('deleteQuestion')),
    }),
  })(component);
}

export interface IQuestionMutation {
  addLikertQuestion?(outcomeSetID: string, question: string, minValue: number, maxValue: number, description?: string, categoryID?: string, labels?: ILabel[]): Promise<IOutcomeSet>;
  editLikertQuestion?(outcomeSetID: string, questionID: string, question: string, description?: string, labels?: ILabel[]): Promise<IOutcomeSet>;
  deleteQuestion?(outcomeSetID: string, questionID: string): Promise<IOutcomeSet>;
}
