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

const BaselineReportInner = (p: IProp) => {
  const { t } = useTranslation();
  const setURL = useNavigator();

  const initialSnapshotReport = useMemo<ISnapshotReport>(() => {
    const r = p.report.getReport;
    return {
      beneficiaries: r.beneficiaries.map<IBenAggregation>((b) => ({
        id: b.id,
        questions: b.questions.map<IAggregation>((q) => ({
          id: q.id,
          value: q.initial.value,
        })),
        categories: b.categories.map<IAggregation>((c) => ({
          id: c.id,
          value: c.initial.value,
        })),
      })),
      questions: r.questions.map<IAggregation>((q) => ({
        id: q.id,
        value: q.initial,
      })),
      categories: r.categories.map<IAggregation>((c) => ({
        id: c.id,
        value: c.initial,
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
      snapshot={initialSnapshotReport}
      exportData={exportData}
      introText={t(
        "This report shows the initial response from each beneficiary"
      )}
      seriesLabel={t("Initial")}
    />
  );
};

// t("report")
const BaselineInnerWithSpinner = ApolloLoaderHoC<IProp>(
  "report",
  (p: IProp) => p.report,
  BaselineReportInner
);
// t("questionnaire")
const BaselineInnerWithSpinners = ApolloLoaderHoC(
  "questionnaire",
  (p: IProp) => p.data,
  BaselineInnerWithSpinner
);

const BaselineInnerWithReport = getReport<IProp>(
  (p) => reportOpts(p),
  "report"
)(BaselineInnerWithSpinners);

const BaselineReport = getOutcomeSet<IUserReportOptions>(
  (p) => p.questionnaire
)(BaselineInnerWithReport);

export { BaselineReport };
