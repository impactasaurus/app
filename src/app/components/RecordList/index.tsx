import React from "react";
import { Table, Icon, Popup } from "semantic-ui-react";
import { IMeeting, sortMeetingsByDateThenCreated } from "../../models/meeting";
import { renderArrayForArray } from "../../helpers/react";
import { useNavigator } from "redux/modules/url";
import { deleteMeeting, IDeleteMeetingMutation } from "apollo/modules/meetings";
import { ConfirmButton } from "components/ConfirmButton";
import { Tags } from "../Tag";
import { useTranslation } from "react-i18next";
import { ISODateString } from "components/Moment";
import { TooltipButton } from "components/TooltipButton";
import { forwardURLParam } from "helpers/url";
import { DateFormats } from "helpers/moment";
import "./style.less";

interface IProp extends IDeleteMeetingMutation {
  meetings: IMeeting[];
}

const RecordListInner = (p: IProp) => {
  const { t } = useTranslation();
  const setURL = useNavigator();

  const resume = (m: IMeeting): (() => void) => {
    return () => {
      setURL(`/meeting/${m.id}`);
    };
  };

  const view = (m: IMeeting): (() => void) => {
    return () => {
      setURL(
        `/meeting/${m.id}/view`,
        forwardURLParam(window.location.pathname)
      );
    };
  };

  const edit = (m: IMeeting): (() => void) => {
    return () => {
      setURL(
        `/meeting/${m.id}/edit`,
        forwardURLParam(window.location.pathname)
      );
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
      <TooltipButton
        key="edit"
        buttonProps={{
          onClick: edit(r),
          icon: "edit",
          compact: true,
          size: "tiny",
        }}
        tooltipContent={t("Edit")}
      />
    );
    if (r.incomplete) {
      actions.push(
        <TooltipButton
          key="continue"
          buttonProps={{
            onClick: resume(r),
            icon: "arrow right",
            compact: true,
            size: "tiny",
          }}
          tooltipContent={t("Continue")}
        />
      );
    } else {
      actions.push(
        <TooltipButton
          key="view"
          buttonProps={{
            onClick: view(r),
            icon: "eye",
            compact: true,
            size: "tiny",
          }}
          tooltipContent={t("View")}
        />
      );
    }
    return actions;
  };

  const renderRecord = (r: IMeeting): JSX.Element[] => {
    let date = <ISODateString iso={r.date} format={DateFormats.SHORT} />;
    if (r.incomplete) {
      date = (
        <Popup
          trigger={<Icon name="hourglass half" />}
          content={
            <div>
              <div>{t("Incomplete")}</div>
              <div>
                {t("Created")}:{" "}
                <ISODateString iso={r.created} format={DateFormats.SHORT} />
              </div>
            </div>
          }
        />
      );
    }
    return [
      <Table.Row key={r.id}>
        <Table.Cell>{date}</Table.Cell>
        <Table.Cell>{r.outcomeSet.name}</Table.Cell>
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
            sortMeetingsByDateThenCreated(p.meetings, false)
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

const RecordList = deleteMeeting<IProp>(RecordListInner);
export { RecordList };
