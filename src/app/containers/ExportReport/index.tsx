import React, { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { exportReport, IExportReportResult } from "apollo/modules/reports";
import { Error } from "components/Error";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import { getURLReportOptions } from "containers/Report/helpers";
import * as config from "../../../../config/main";

interface IProp {
  data: IExportReportResult;
  match: {
    params: {
      questionSetID: string;
      start: string;
      end: string;
    };
  };
  location: {
    search: string;
    open: boolean;
  };
}

const ExportReportInner = (p: IProp) => {
  useEffect(() => {
    if (p.data.exportReport) {
      window.location.href = config.app.api + p.data.exportReport;
    }
  }, [p.data.exportReport]);

  const { t } = useTranslation();
  if (p.data.error) {
    return <Error text={t("Export failed")} />;
  }
  if (p.data.loading) {
    return <Loader active={true} inline="centered" />;
  }
  return <span>{t("Download started")}</span>;
};

const ExportReportData = exportReport<IProp>((p) =>
  getURLReportOptions(p.match.params, new URLSearchParams(p.location.search))
)(ExportReportInner);
// t("Report Export")
const ExportReport = MinimalPageWrapperHoC(
  "Report Export",
  "data",
  ExportReportData
);
export { ExportReport };
