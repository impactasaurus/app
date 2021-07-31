import React, { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { exportMeetings, IExportMeetingsResult } from "apollo/modules/meetings";
import { Error } from "components/Error";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import * as appConfig from "../../../../config/main";
import { getSearchParam, ISearchParam } from "helpers/url";

interface IProps extends ISearchParam {
  data: IExportMeetingsResult;
  match: {
    params: {
      id: string;
    };
  };
}

const ExportQuestionnaireInner = (p: IProps) => {
  useEffect(() => {
    if (p.data.exportMeetings) {
      window.location.href = appConfig.app.api + p.data.exportMeetings;
    }
  }, [p.data.exportMeetings]);

  const { t } = useTranslation();
  if (p.data.error) {
    return <Error text={t("Export failed")} />;
  }
  if (p.data.loading) {
    return <Loader active={true} inline="centered" />;
  }
  return <span>{t("Download started")}</span>;
};

const ExportQuestionnaireData = exportMeetings(
  (p: IProps) => p.match.params.id,
  getSearchParam<string>("start"),
  getSearchParam<string>("end"),
  getSearchParam<string[]>("tags"),
  getSearchParam<boolean>("or")
)(ExportQuestionnaireInner);
// t("Questionnaire Export")
const ExportQuestionnaire = MinimalPageWrapperHoC(
  "Questionnaire Export",
  "data",
  ExportQuestionnaireData
);
export { ExportQuestionnaire };
