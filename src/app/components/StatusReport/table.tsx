import React, { useState, useEffect } from "react";
import { ILatestAggregationReport } from "models/report";
import { Table } from "semantic-ui-react";
import { renderArray } from "helpers/react";
import { Direction, directionSpec } from "helpers/table";
import {
  getCategoryFriendlyName,
  getQuestionFriendlyName,
} from "helpers/questionnaire";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";

interface IProps {
  report: ILatestAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

interface IRow {
  name: string;
  value: number;
}

enum Column {
  NAME,
  VALUE,
}

const renderRow = (r: IRow): JSX.Element => (
  <Table.Row key={r.name}>
    <Table.Cell>{r.name}</Table.Cell>
    <Table.Cell>{r.value}</Table.Cell>
  </Table.Row>
);

function sortData(data: IRow[], column: Column, direction: Direction): IRow[] {
  return data.concat().sort((a, b) => {
    const adjustResponseOnDirection = (resp: number): number => {
      return direction === Direction.ASC ? resp : -resp;
    };
    if (column === Column.NAME) {
      return adjustResponseOnDirection(
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
    const aVal: number | undefined = a.value,
      bVal: number | undefined = b.value;
    if (aVal === undefined && bVal !== undefined) {
      return adjustResponseOnDirection(-1);
    } else if (bVal === undefined && aVal !== undefined) {
      return adjustResponseOnDirection(1);
    } else if (aVal === undefined && bVal === undefined) {
      return adjustResponseOnDirection(0);
    }
    return adjustResponseOnDirection(aVal - bVal);
  });
}

const getRows = (p: IProps): IRow[] => {
  const latestData = p.category ? p.report.categories : p.report.questions;
  return latestData.map((d) => {
    const label = p.category
      ? getCategoryFriendlyName(d.id, p.questionSet)
      : getQuestionFriendlyName(d.id, p.questionSet);
    return {
      name: label,
      value: d.latest,
    };
  });
};

export const StatusReportTable = (p: IProps): JSX.Element => {
  const [column, setColumn] = useState<Column>(Column.NAME);
  const [direction, setDirection] = useState<Direction>(Direction.ASC);
  const [data, setData] = useState<IRow[]>();
  const { t } = useTranslation();

  useEffect(() => {
    const rows = getRows(p);
    const sorted = sortData(rows, column, direction);
    setData(sorted);
  }, [p, column, direction]);

  const handleSort = (col: Column): (() => void) => {
    return () => {
      if (col !== column) {
        setDirection(Direction.ASC);
        setColumn(col);
      } else {
        const newDir =
          direction === Direction.ASC ? Direction.DESC : Direction.ASC;
        setDirection(newDir);
      }
    };
  };

  const nameCol = p.category ? t("Category") : t("Question");
  return (
    <Table striped={true} celled={true} sortable={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={column === Column.NAME ? directionSpec(direction) : null}
            onClick={handleSort(Column.NAME)}
          >
            {nameCol}
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === Column.VALUE ? directionSpec(direction) : null}
            onClick={handleSort(Column.VALUE)}
          >
            {t("Value")}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{renderArray(renderRow, data)}</Table.Body>
    </Table>
  );
};
