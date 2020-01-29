import * as React from 'react';
import {getOrgUsers, IGetOrgUsersResult} from 'apollo/modules/organisation';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';

interface IProps  {
  users?: IGetOrgUsersResult;
}

class OrganisationUsersInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    const userDivs = this.props.users.getOrganisation.map((u) => <div key={u}>{u}</div>);
    return (
      <div>
        {userDivs}
      </div>
    );
  }
}

const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>('users', (p: IProps) => p.users, OrganisationUsersInner);
const OrganisationUsers = getOrgUsers(OrgUsersWithSpinner, 'users');
export { OrganisationUsers };
