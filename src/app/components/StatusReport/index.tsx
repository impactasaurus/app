import React, { useMemo } from "react";
import { getReport, IReportResponse } from "apollo/modules/reports";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import {
  exportReportData,
  IReportOptions,
  IUserReportOptions,
} from "containers/Report/helpers";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import {
  IAggregation,
  IBenAggregation,
  ISnapshotReport,
  SnapshotReport,
} from "components/SnapshotReport";
import { useNavigator } from "redux/modules/url";
import { useTranslation } from "react-i18next";

export interface IProp extends IUserReportOptions {
  data: IOutcomeResult;
  report: IReportResponse;
}

const reportOpts = (p: IProp): IReportOptions => ({ minRecords: 1, ...p });

const StatusReportInner = (p: IProp) => {
  const setURL = useNavigator();
  const { t } = useTranslation();

  const latestSnapshotReport = useMemo<ISnapshotReport>(() => {
    const r = p.report.getReport;
    return {
      beneficiaries: r.beneficiaries.map<IBenAggregation>((b) => ({
        id: b.id,
        questions: b.questions.map<IAggregation>((q) => ({
          id: q.id,
          value: q.latest.value,
        })),
        categories: b.categories.map<IAggregation>((c) => ({
          id: c.id,
          value: c.latest.value,
        })),
      })),
      questions: r.questions.map<IAggregation>((q) => ({
        id: q.id,
        value: q.latest,
      })),
      categories: r.categories.map<IAggregation>((c) => ({
        id: c.id,
        value: c.latest,
      })),
      excluded: r.excluded,
    };
  }, [p.report.getReport]);

  const exportData = () => {
    exportReportData(setURL, reportOpts(p));
  };

  return (
    <SnapshotReport
      questionnaire={p.data.getOutcomeSet}
      snapshot={latestSnapshotReport}
      exportData={exportData}
      introText={t(
        "This report shows the most recent response from each beneficiary"
      )}
      seriesLabel={t("Latest")}
    />
  );
};

// t("report")
const StatusInnerWithSpinner = ApolloLoaderHoC<IProp>(
  "report",
  (p: IProp) => p.report,
  StatusReportInner
);
// t("questionnaire")
const StatusInnerWithSpinners = ApolloLoaderHoC(
  "questionnaire",
  (p: IProp) => p.data,
  StatusInnerWithSpinner
);

const StatusInnerWithReport = getReport<IProp>(
  (p) => reportOpts(p),
  "report"
)(StatusInnerWithSpinners);

const StatusReport = getOutcomeSet<IUserReportOptions>((p) => p.questionnaire)(
  StatusInnerWithReport
);

export { StatusReport };
