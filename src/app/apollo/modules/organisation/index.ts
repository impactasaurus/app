import {gql, graphql, QueryProps} from 'react-apollo';
import {IOrganisation} from 'models/organisation';

export const getOrganisation = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getOrganisation: organisation {
        id,
        name,
        settings{
          beneficiaryTypeAhead
        }
      }
    }`, {
    options: () => {
      return {
        fetchPolicy: 'network-only',
      };
    },
    name,
  })(component);
};

export interface IGetOrgResult extends QueryProps {
  getOrganisation?: IOrganisation;
}
