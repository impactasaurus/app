import * as React from "react";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { constructReportQueryParams, constructReportURL } from "helpers/report";
import { IFormOutput, ReportForm as RFComponent } from "components/ReportForm";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";

const RFWrapped = QuestionnaireRequired(RFComponent);

const dateDiff = (date1: Date, date2: Date): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  // converting both dates to milliseconds
  const firstMs = date1.getTime();
  const secondMs = date2.getTime();
  // calculate the difference
  const diff = secondMs - firstMs;
  // returning the number of weeks
  return Math.round(diff / (oneDay * 7));
};

const logGAEvent = (v: IFormOutput): void => {
  if (v.all) {
    ReactGA.event({
      category: "servicereport",
      action: "all",
    });
  } else {
    const value = dateDiff(v.start, v.end);
    ReactGA.event({
      category: "servicereport",
      action: "range",
      value,
    });
  }
};

const ReportFormInner = (p: IURLConnector) => {
  const navigateToReport = (v: IFormOutput) => {
    let start = v.start;
    let end = v.end;
    if (v.all) {
      start = new Date(0);
      end = new Date();
    }
    logGAEvent(v);
    const url = constructReportURL("service", start, end, v.questionSetID);
    const qp = constructReportQueryParams(v.tags, false, v.orTags);
    p.setURL(url, qp);
  };

  const { t } = useTranslation();
  return <RFWrapped t={t} onFormSubmit={navigateToReport} />;
};

// t('Report')
const ReportFormWrapped = PageWrapperHoC(
  "Report",
  "report-form-page",
  ReportFormInner
);
const ReportForm = UrlHOC(ReportFormWrapped);
export { ReportForm };
