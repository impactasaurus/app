import * as React from "react";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { IFormOutput, ReportForm as RFComponent } from "components/ReportForm";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { reportURL } from "containers/Report/helpers";

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
  const { t } = useTranslation();

  const navigateToReport = (v: IFormOutput) => {
    let start = v.start;
    let end = v.end;
    if (v.all) {
      start = new Date(0);
      end = new Date();
    }
    logGAEvent(v);
    const { url, params } = reportURL("service", {
      questionnaire: v.questionSetID,
      start,
      end,
      tags: v.tags,
      orTags: v.orTags,
      openStart: false,
    });
    p.setURL(url, params);
  };

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
