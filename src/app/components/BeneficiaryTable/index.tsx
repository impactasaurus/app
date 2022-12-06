import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "semantic-ui-react";
import { BeneficiaryTableRow } from "./row";

const Inner = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Table celled={true} striped={true} compact={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{t("Beneficiary")}</Table.HeaderCell>
          <Table.HeaderCell>{t("Tags")}</Table.HeaderCell>
          <Table.HeaderCell>{t("Record Count")}</Table.HeaderCell>
          <Table.HeaderCell>{t("First Record")}</Table.HeaderCell>
          <Table.HeaderCell>{t("Latest Record")}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
        <BeneficiaryTableRow />
      </Table.Body>
    </Table>
  );
};

export const BeneficiaryTable = Inner;
