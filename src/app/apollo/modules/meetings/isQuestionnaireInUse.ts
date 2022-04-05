import { ChildProps, gql, graphql } from "react-apollo";
import { ComponentDecorator, QueryProps } from "react-apollo/types";

export interface IIsQuestionnaireInUse extends QueryProps {
  isQuestionnaireInUse: {
    meetings: string[];
  };
}

export const isQuestionnaireInUse = <T>(
  questionnaireID: (p: T) => string,
  name = "data"
): ComponentDecorator<T, ChildProps<T, any>> => {
  return graphql<any, T>(
    gql`
      query ($questionnaireID: String) {
        isQuestionnaireInUse: recentMeetings(
          page: 0
          limit: 1
          questionnaires: [$questionnaireID]
        ) {
          meetings {
            id
          }
        }
      }
    `,
    {
      options: (p: T) => {
        return {
          fetchPolicy: "cache-and-network",
          variables: {
            questionnaireID: questionnaireID(p),
          },
          notifyOnNetworkStatusChange: true,
        };
      },
      name,
    }
  );
};
