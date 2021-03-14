import React from 'react';
import {getOrgUsers, IGetOrgUsersResult, IOrgUser} from 'apollo/modules/organisation';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {Table, Label, Popup} from 'semantic-ui-react';
import {renderArrayForArray} from 'helpers/react';
import {getHumanisedDate} from 'helpers/moment';
import {ConfirmButton} from 'components/ConfirmButton';
import {IUpdateUser, updateUser} from 'apollo/modules/user';
import {useTranslation} from 'react-i18next';
import './style.less';

interface IProps extends IUpdateUser {
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

const OrganisationUsersInner = (p: IProps) => {

  const {t} = useTranslation();
  const messages = {
    activeUser: t("This user can access your organisation's data"),
    suspendedUser: t("This user cannot access your organisation's data"),
    suspendUser: t("Suspending a user blocks them from logging in to your Impactasaurus"),
    reinstateUser: t("Reinstating a user allows them to log in and access your organisation's data again")
  };

  const suspend = (u: IOrgUser): () => Promise<any> => {
    return () => {
      return p.updateUser(u.id, false);
    };
  };

  const reinstate = (u: IOrgUser): () => Promise<any> => {
    return () => {
      return p.updateUser(u.id, true);
    };
  }

  const renderUser = (u: IOrgUser): JSX.Element[] => {
    const deleteButton = (
      <ConfirmButton
        onConfirm={suspend(u)}
        promptText={t("Are you sure you want to suspend this user?")}
        buttonProps={{icon: 'delete', compact:true, size:'tiny'}}
        tooltip={messages.suspendUser}
        stopSpinnerOnCompletion={true}
      />
    );
    const reinstateButton = (
      <ConfirmButton
        onConfirm={reinstate(u)}
        promptText={t("Are you sure you want to reinstate this user?")}
        buttonProps={{icon: 'undo', compact:true, size:'tiny'}}
        tooltip={messages.reinstateUser}
        stopSpinnerOnCompletion={true}
      />
    );
    return [(
      <Table.Row key={u.id} className={'user ' + (u.active ? '' : 'inactive')}>
        <Table.Cell>{u.name}</Table.Cell>
        <Table.Cell>{getHumanisedDate(u.joined)}</Table.Cell>
        <Table.Cell>
          <Popup
            trigger={<Label>{u.active ? t('Active') : t('Suspended')}</Label>}
            content={u.active ? messages.activeUser : messages.suspendedUser}
          />
        </Table.Cell>
        <Table.Cell className="actions">
          {u.active ? deleteButton : reinstateButton}
        </Table.Cell>
      </Table.Row>
    )];
  }

  return (
    <div id="org-users">
      <Table celled={true} striped={true} className="org-user-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("Name")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Joined")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Status")}</Table.HeaderCell>
            <Table.HeaderCell className="actions-header">{t("Actions")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderArrayForArray(renderUser, sortByStatusThenName(p.getOrgUsers.users))}
        </Table.Body>
      </Table>
    </div>
  );
}

const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>('users', (p: IProps) => p.getOrgUsers, OrganisationUsersInner);
const OrganisationUsers = updateUser(getOrgUsers(OrgUsersWithSpinner, 'getOrgUsers'));
export { OrganisationUsers };
