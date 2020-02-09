import * as React from 'react';
import {getOrgUsers, IGetOrgUsersResult, IOrgUser} from 'apollo/modules/organisation';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {Table} from 'semantic-ui-react';
import {renderArrayForArray} from 'helpers/react';

interface IProps  {
  getOrgUsers?: IGetOrgUsersResult;
}

export function sortByName(users: IOrgUser[]): IOrgUser[] {
  return users.concat().sort((a, b): number => {
    return a.name.localeCompare(b.name);
  });
}

class OrganisationUsersInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  private renderUser(u: IOrgUser): JSX.Element[] {
    return [(
      <Table.Row key={u.id}>
        <Table.Cell>{u.name}</Table.Cell>
        <Table.Cell className="actions">Coming soon</Table.Cell>
      </Table.Row>
    )];
  }

  public render() {
    return (
      <div id="org-users">
        <Table celled={true} striped={true} className="org-user-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell className="actions-header">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderArrayForArray(this.renderUser, sortByName(this.props.getOrgUsers.users))}
          </Table.Body>
        </Table>
      </div>

    );
  }
}

const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>('users', (p: IProps) => p.getOrgUsers, OrganisationUsersInner);
const OrganisationUsers = getOrgUsers(OrgUsersWithSpinner, 'getOrgUsers');
export { OrganisationUsers };
