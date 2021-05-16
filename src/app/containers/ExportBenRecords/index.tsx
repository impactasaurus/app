import React, { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import {
  exportBenMeetings,
  IExportBenMeetingsResult,
} from "apollo/modules/meetings";
import { Error } from "components/Error";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import * as config from "../../../../config/main";

interface IProps {
  data: IExportBenMeetingsResult;
  match: {
    params: {
      id: string;
      qid: string;
    };
  };
}

const ExportBenRecordsInner = (p: IProps) => {
  useEffect(() => {
    if (p.data.exportBenMeetings) {
      window.location.href = config.app.api + p.data.exportBenMeetings;
    }
  }, [p.data.exportBenMeetings]);

  const { t } = useTranslation();
  if (p.data.error) {
    return <Error text={t("Export failed")} />;
  }
  if (p.data.loading) {
    return <Loader active={true} inline="centered" />;
  }
  return <span>{t("Download started")}</span>;
};

const ExportBenRecordsData = exportBenMeetings(
  (p: IProps) => p.match.params.qid,
  (p: IProps) => p.match.params.id
)(ExportBenRecordsInner);
// t("Beneficiary Record Export")
const ExportBenRecords = MinimalPageWrapperHoC(
  "Beneficiary Record Export",
  "data",
  ExportBenRecordsData
);
export { ExportBenRecords };
