import * as React from 'react';
import {getOrgUsers, IGetOrgUsersResult} from 'apollo/modules/organisation';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';

interface IProps  {
  getOrgUsers?: IGetOrgUsersResult;
}

class OrganisationUsersInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    const userDivs = this.props.getOrgUsers.users.map((u) => <div key={u.id}>{u.name}</div>);
    return (
      <div>
        {userDivs}
      </div>
    );
  }
}

const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>('users', (p: IProps) => p.getOrgUsers, OrganisationUsersInner);
const OrganisationUsers = getOrgUsers(OrgUsersWithSpinner, 'getOrgUsers');
export { OrganisationUsers };
