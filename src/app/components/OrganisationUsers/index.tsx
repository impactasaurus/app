import * as React from 'react';
import {getOrgUsers, IGetOrgUsersResult, IOrgUser} from 'apollo/modules/organisation';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {Table, Label, Popup} from 'semantic-ui-react';
import {renderArrayForArray} from 'helpers/react';
import {getHumanisedDate} from 'helpers/moment';
import {ConfirmButton} from 'components/ConfirmButton';
import './style.less';

interface IProps  {
  getOrgUsers?: IGetOrgUsersResult;
}

export function sortByStatusThenName(users: IOrgUser[]): IOrgUser[] {
  return users.concat().sort((a, b): number => {
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

class OrganisationUsersInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.suspend = this.suspend.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.reinstate = this.reinstate.bind(this);
  }

  private suspend(u: IOrgUser): () => Promise<any> {
    return () => {
      console.log('suspend ' + u.name);
      return Promise.resolve();
    };
  }

  private reinstate(u: IOrgUser): () => Promise<any> {
    return () => {
      console.log('reinstate ' + u.name);
      return Promise.resolve();
    };
  }

  private renderUser(u: IOrgUser): JSX.Element[] {
    const deleteButton = (
      <ConfirmButton
        onConfirm={this.suspend(u)}
        promptText="Are you sure you want to suspend this user?"
        buttonProps={{icon: 'delete', compact:true, size:'tiny'}}
        tooltip="Suspend account"
        stopSpinnerOnCompletion={true}
      />
    );
    const reinstateButton = (
      <ConfirmButton
        onConfirm={this.reinstate(u)}
        promptText="Are you sure you want to reinstate this user?"
        buttonProps={{icon: 'undo', compact:true, size:'tiny'}}
        tooltip="Reinstate account"
        stopSpinnerOnCompletion={true}
      />
    );
    return [(
      <Table.Row key={u.id} className={'user ' + (u.active ? '' : 'inactive')}>
        <Table.Cell>{u.name}</Table.Cell>
        <Table.Cell>{getHumanisedDate(u.joined)}</Table.Cell>
        <Table.Cell>
          <Popup
            trigger={<Label>{u.active ? 'Active' : 'Suspended'}</Label>}
            content={u.active ? 'active' : 'suspended'}
          />
        </Table.Cell>
        <Table.Cell className="actions">
          {u.active ? deleteButton : reinstateButton}
        </Table.Cell>
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
              <Table.HeaderCell>Joined</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell className="actions-header">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderArrayForArray(this.renderUser, sortByStatusThenName(this.props.getOrgUsers.users))}
          </Table.Body>
        </Table>
      </div>

    );
  }
}

const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>('users', (p: IProps) => p.getOrgUsers, OrganisationUsersInner);
const OrganisationUsers = getOrgUsers(OrgUsersWithSpinner, 'getOrgUsers');
export { OrganisationUsers };
