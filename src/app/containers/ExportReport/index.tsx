import React, { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { exportReport, IExportReportResult } from "apollo/modules/reports";
import { Error } from "components/Error";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
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

function getQuestionSetIDFromProps(p: IProp): string {
  return p.match.params.questionSetID;
}

function getStartDateFromProps(p: IProp): string {
  return p.match.params.start;
}

function getEndDateFromProps(p: IProp): string {
  return p.match.params.end;
}

function getTagsFromProps(p: IProp): string[] {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("tags") === false) {
    return [];
  }
  const tags = urlParams.get("tags");
  const parsedTags = JSON.parse(tags);
  return parsedTags;
}

function getOpenFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("open") === false) {
    return false;
  }
  const open = urlParams.get("open");
  return JSON.parse(open);
}

function getOrFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("or") === false) {
    return false;
  }
  return JSON.parse(urlParams.get("or"));
}

const ExportReportData = exportReport(
  getQuestionSetIDFromProps,
  getStartDateFromProps,
  getEndDateFromProps,
  getTagsFromProps,
  getOpenFromProps,
  getOrFromProps
)(ExportReportInner);
// t("Report Export")
const ExportReport = MinimalPageWrapperHoC(
  "Report Export",
  "data",
  ExportReportData
);
export { ExportReport };
