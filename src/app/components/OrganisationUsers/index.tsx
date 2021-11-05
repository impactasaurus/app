import React from "react";
import {
  getOrgUsers,
  IGetOrgUsersResult,
  IOrgUser,
  IRemoveOrgUser,
  removeOrgUser,
} from "apollo/modules/organisation";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { Icon, Popup, Table } from "semantic-ui-react";
import { renderArrayForArray } from "helpers/react";
import { ConfirmButton } from "components/ConfirmButton";
import { useTranslation } from "react-i18next";
import { DateString } from "components/Moment";
import "./style.less";

interface IProps extends IRemoveOrgUser {
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
  const { t } = useTranslation();

  const removeUser = (u: IOrgUser): (() => Promise<any>) => {
    return () => {
      return p.removeOrgUser(u.id);
    };
  };

  const InactiveIcon = (
    <Popup
      trigger={<Icon name="warning circle" />}
      content={t(
        "This user is blocked and will not be able to access your organisation's data"
      )}
    />
  );

  const renderUser = (u: IOrgUser): JSX.Element[] => {
    return [
      <Table.Row key={u.id} className={"user " + (u.active ? "" : "inactive")}>
        <Table.Cell>
          {u.active !== true && InactiveIcon}
          <span>{u.name}</span>
        </Table.Cell>
        <Table.Cell>
          <DateString date={u.joined} />
        </Table.Cell>
        <Table.Cell className="actions">
          <ConfirmButton
            onConfirm={removeUser(u)}
            promptText={t(
              "Are you sure you want to remove this user from your organisation?"
            )}
            buttonProps={{ icon: "delete", compact: true, size: "tiny" }}
            stopSpinnerOnCompletion={false}
            tooltip={t("Remove user")}
          />
        </Table.Cell>
      </Table.Row>,
    ];
  };

  return (
    <div id="org-users">
      <Table celled={true} striped={true} className="org-user-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("Name")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Joined")}</Table.HeaderCell>
            <Table.HeaderCell className="actions-header">
              {t("Actions")}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderArrayForArray(
            renderUser,
            sortByStatusThenName(p.getOrgUsers.users)
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

// t("users")
const OrgUsersWithSpinner = ApolloLoaderHoC<IProps>(
  "users",
  (p: IProps) => p.getOrgUsers,
  OrganisationUsersInner
);
const OrganisationUsers = removeOrgUser(
  getOrgUsers(OrgUsersWithSpinner, "getOrgUsers")
);
export { OrganisationUsers };
