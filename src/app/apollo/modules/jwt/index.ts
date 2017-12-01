import {gql, graphql, QueryProps} from 'react-apollo';
import {IDExtractor} from 'helpers/apollo';

export const getJWT = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query ($id: String!){
      getJWT: jwt(jti:$id)
    }`, {
    options: (props: T) => {
      return {
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

export interface IJWTResult extends QueryProps {
    getJWT?: string;
}
