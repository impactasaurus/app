import React from "react";
import { Table, Icon, Popup, Button } from "semantic-ui-react";
import { IMeeting, sortMeetingsByConducted } from "../../models/meeting";
import { renderArrayForArray } from "../../helpers/react";
import { getHumanisedDate } from "../../helpers/moment";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { deleteMeeting, IDeleteMeetingMutation } from "apollo/modules/meetings";
import { ConfirmButton } from "components/ConfirmButton";
import { Link } from "react-router-dom";
import { Tags } from "../Tag";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProp extends IURLConnector, IDeleteMeetingMutation {
  meetings: IMeeting[];
}

const RecordListInner = (p: IProp) => {
  const { t } = useTranslation();

  const resume = (m: IMeeting): (() => void) => {
    return () => {
      p.setURL(`/meeting/${m.id}`);
    };
  };

  const view = (m: IMeeting): (() => void) => {
    return () => {
      p.setURL(`/meeting/${m.id}/view`, `?next=${window.location.pathname}`);
    };
  };

  const edit = (m: IMeeting): (() => void) => {
    return () => {
      p.setURL(`/meeting/${m.id}/edit`, `?next=${window.location.pathname}`);
    };
  };

  const del = (m: IMeeting): (() => Promise<any>) => {
    return () => {
      return p.deleteMeeting(m.id, m.beneficiary);
    };
  };

  const renderActions = (r: IMeeting): JSX.Element[] => {
    const actions: JSX.Element[] = [];
    actions.push(
      <ConfirmButton
        key="delete"
        onConfirm={del(r)}
        promptText={t("Are you sure you want to delete this record?")}
        buttonProps={{ icon: "delete", compact: true, size: "tiny" }}
        tooltip={t("Delete")}
      />
    );
    actions.push(
      <Popup
        key="edit"
        trigger={
          <Button onClick={edit(r)} icon="edit" compact={true} size="tiny" />
        }
        content={t("Edit")}
      />
    );
    if (r.incomplete) {
      actions.push(
        <Popup
          key="continue"
          trigger={
            <Button
              onClick={resume(r)}
              icon="arrow right"
              compact={true}
              size="tiny"
            />
          }
          content={t("Continue")}
        />
      );
    } else {
      actions.push(
        <Popup
          key="view"
          trigger={
            <Button onClick={view(r)} icon="eye" compact={true} size="tiny" />
          }
          content={t("View")}
        />
      );
    }
    return actions;
  };

  const renderRecord = (r: IMeeting): JSX.Element[] => {
    let incomplete = <span />;
    if (r.incomplete) {
      incomplete = (
        <Popup
          trigger={<Icon name="hourglass half" />}
          content={t("Incomplete")}
        />
      );
    }
    return [
      <Table.Row key={r.id}>
        <Table.Cell>
          {getHumanisedDate(new Date(r.conducted))}
          {incomplete}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/questions/${r.outcomeSet.id}`}>{r.outcomeSet.name}</Link>
        </Table.Cell>
        <Table.Cell>
          <Tags recordTags={r.meetingTags} benTags={r.benTags} />
        </Table.Cell>
        <Table.Cell>{r.user}</Table.Cell>
        <Table.Cell className="actions">{renderActions(r)}</Table.Cell>
      </Table.Row>,
    ];
  };

  return (
    <div id="record-list">
      <Table celled={true} striped={true} className="record-list-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("Date")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Questionnaire")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Tags")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Facilitator")}</Table.HeaderCell>
            <Table.HeaderCell className="actions-header">
              {t("Actions")}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderArrayForArray(
            renderRecord,
            sortMeetingsByConducted(p.meetings, false)
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

const RecordListConnected = UrlHOC(RecordListInner);
const RecordList = deleteMeeting<IProp>(RecordListConnected);
export { RecordList };
