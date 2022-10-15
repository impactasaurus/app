import React, { useState, useEffect } from "react";
import { Aggregation } from "models/pref";
import { IMeeting } from "models/meeting";
import { Answer } from "models/answer";
import { ICategoryAggregate } from "models/aggregates";
import { ImpactTable, IRow } from "components/ImpactTable";
import { getHumanisedDate } from "helpers/moment";
import { Select, DropdownItemProps, Message } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

const findMeeting = (
  meetings: IMeeting[],
  comp: (fm: IMeeting, fc: number, sm: IMeeting, sc: number) => IMeeting
): IMeeting | undefined => {
  return meetings.reduce(
    (last: IMeeting | undefined, m: IMeeting): IMeeting => {
      if (last === undefined) {
        return m;
      }
      const mConducted = Date.parse(m.completed);
      const lConducted = Date.parse(last.completed);
      return comp(m, mConducted, last, lConducted);
    },
    undefined
  );
};

const initialMeeting = (meetings: IMeeting[]): IMeeting | undefined => {
  return findMeeting(meetings, (fm, fc, sm, sc) => {
    return sc < fc ? sm : fm;
  });
};

const lastMeeting = (meetings: IMeeting[]): IMeeting | undefined => {
  return findMeeting(meetings, (fm, fc, sm, sc) => {
    return sc > fc ? sm : fm;
  });
};

const MeetingTable = (p: IProp): JSX.Element => {
  const [firstMeeting, setFirstMeeting] = useState(initialMeeting(p.meetings));
  const [secondMeeting, setSecondMeeting] = useState(lastMeeting(p.meetings));
  const { t } = useTranslation();

  useEffect(() => {
    setFirstMeeting(initialMeeting(p.meetings));
    setSecondMeeting(lastMeeting(p.meetings));
  }, [p.meetings]);

  const getCategoryRows = (): IRow[] => {
    const f = firstMeeting;
    const l = secondMeeting;
    let rows = f.aggregates.category.reduce(
      (rows: any, c: ICategoryAggregate) => {
        const category = f.outcomeSet.categories.find(
          (x) => x.id === c.categoryID
        );
        rows[category.name] = {
          first: c.value,
          name: category.name,
        };
        return rows;
      },
      {}
    );
    rows = l.aggregates.category.reduce((rows: any, c: ICategoryAggregate) => {
      const category = l.outcomeSet.categories.find(
        (x) => x.id === c.categoryID
      );
      if (rows[category.name] === undefined) {
        rows[category.name] = {
          name: category.name,
        };
      }
      rows[category.name] = { ...rows[category.name], last: c.value };
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  };

  const getQuestionRows = (): IRow[] => {
    const f = firstMeeting;
    const l = secondMeeting;
    let rows = f.answers.reduce((rows: any, a: Answer) => {
      const q = f.outcomeSet.questions.find((x) => x.id === a.questionID);
      if (q === undefined || q.archived) {
        return rows;
      }
      rows[q.question] = {
        first: a.answer,
        name: q.short || q.question,
      };
      return rows;
    }, {});
    rows = l.answers.reduce((rows: any, a: Answer) => {
      const q = l.outcomeSet.questions.find((x) => x.id === a.questionID);
      if (q === undefined || q.archived) {
        return rows;
      }
      if (rows[q.question] === undefined) {
        rows[q.question] = {
          name: q.short || q.question,
        };
      }
      rows[q.question] = { ...rows[q.question], last: a.answer };
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  };

  const getColumnTitle = (prefix: string, meeting: IMeeting): string => {
    return `${prefix} (${getHumanisedDate(new Date(meeting.completed))})`;
  };

  const onFirstMeetingSelectChange = (_, { value }): void => {
    const fm = p.meetings.find((meeting) => meeting.id === value);
    setFirstMeeting(fm);
  };

  const onSecondMeetingSelectChange = (_, { value }): void => {
    const sm = p.meetings.find((meeting) => meeting.id === value);
    setSecondMeeting(sm);
  };

  const getMeetingOptions = (): DropdownItemProps[] => {
    const { meetings } = p;

    return Array.from(meetings)
      .sort((a, b) => {
        return Date.parse(a.completed) - Date.parse(b.completed);
      })
      .map((meeting) => {
        return {
          value: meeting.id,
          key: meeting.id,
          text: getHumanisedDate(new Date(meeting.completed)),
        };
      });
  };

  const renderMeetingSelectionForm = (): JSX.Element => {
    return (
      <div id="selectMeetingsContainer">
        <span>{t("First meeting")}</span>
        <Select
          value={firstMeeting.id}
          onChange={onFirstMeetingSelectChange}
          options={getMeetingOptions()}
        />
        <span>{t("Second meeting")}</span>
        <Select
          value={secondMeeting.id}
          onChange={onSecondMeetingSelectChange}
          options={getMeetingOptions()}
        />
      </div>
    );
  };

  const renderTable = (): JSX.Element => {
    const { aggregation } = p;

    const isCat = aggregation === Aggregation.CATEGORY;
    const rows = isCat ? getCategoryRows() : getQuestionRows();
    rows.sort((a, b) => a.name.localeCompare(b.name));

    const areMeetingsSame = firstMeeting.id === secondMeeting.id;

    return (
      <div>
        {areMeetingsSame && (
          <Message info={true}>
            {t("You are currently comparing the same record.")}
          </Message>
        )}
        <ImpactTable
          data={rows}
          nameColName={isCat ? t("Category") : t("Question")}
          firstColName={getColumnTitle(t("First meeting"), firstMeeting)}
          lastColName={getColumnTitle(t("Second meeting"), secondMeeting)}
        />
      </div>
    );
  };

  if (!Array.isArray(p.meetings) || p.meetings.length === 0) {
    return <div />;
  }

  if (firstMeeting === undefined || secondMeeting === undefined) {
    return <div />;
  }

  return (
    <div className="meeting-table">
      {renderMeetingSelectionForm()}
      {renderTable()}
    </div>
  );
};

export { MeetingTable };
