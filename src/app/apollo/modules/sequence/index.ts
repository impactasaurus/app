import { fragment, ISequence } from "models/sequence";
import { gql, graphql, QueryProps } from "react-apollo";

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
