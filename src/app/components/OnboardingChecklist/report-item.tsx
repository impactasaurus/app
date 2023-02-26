import * as React from "react";
import { OnboardingChecklistItem } from "./item";
import {
  hasOrgGeneratedReport,
  IHasOrgGeneratedReport,
} from "apollo/modules/organisation";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { TourStage, tourStageAction } from "redux/modules/tour";
import ReactGA from "react-ga4";

interface IProps {
  data?: IHasOrgGeneratedReport;
  index: number;
  minimal?: boolean; // defaults to false
}

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClick = () => {
    ReactGA.event({
      category: "tour",
      label: "report",
      action: "started-onboarding-list",
    });
    dispatch(tourStageAction(TourStage.REPORT_1));
  };

  const loading = p.data.loading;
  const completed = !loading && p.data.reportGenerated;
  return (
    <OnboardingChecklistItem
      title={t("Generate a report")}
      description={t(
        "Reports are used to demonstrate your impact. Beneficiaries should ideally complete the same questionnaire before and after your intervention so that your impact can be assessed. Create another record for the same beneficiary and then try generating a report."
      )}
      completed={completed}
      loading={loading}
      link="/report"
      index={p.index}
      minimal={p.minimal}
      onClick={onClick}
    />
  );
};

export const ReportChecklistItem = hasOrgGeneratedReport<IProps>(Inner);
