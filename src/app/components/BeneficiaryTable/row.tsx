import React from "react";
import { Table } from "semantic-ui-react";
import { ISOTimeSince } from "components/Moment";
import { Tag } from "components/Tag";

export const BeneficiaryTableRow = (): JSX.Element => {
  return (
    <Table.Row style={{ cursor: "pointer" }} onClick={() => alert("test")}>
      <Table.Cell>
        <a>Dan</a>
      </Table.Cell>
      <Table.Cell>
        <Tag tag="Salisbury" beneficiary={true} />
      </Table.Cell>
      <Table.Cell>5</Table.Cell>
      <Table.Cell>
        <ISOTimeSince iso={"2017-02-02T00:00:00Z"} />
      </Table.Cell>
      <Table.Cell>
        <ISOTimeSince iso={"2022-02-02T00:00:00Z"} />
      </Table.Cell>
    </Table.Row>
  );
};
