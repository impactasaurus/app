import { IDExtractor } from "helpers/apollo";
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
