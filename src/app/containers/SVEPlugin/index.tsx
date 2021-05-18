import React, { useState } from "react";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";
import {
  IFormOutput as ReportForm,
  ReportForm as RFComponent,
} from "components/ReportForm";
import { useTranslation } from "react-i18next";
import { IDeflators, SVECalculator } from "./calculator";

enum Page {
  FORM,
  CALCULATOR,
}

const SVEInner = () => {
  const [page, setPage] = useState(Page.FORM);
  const [reportForm, setReportForm] = useState<ReportForm>();
  const { t } = useTranslation();

  const navigateToCalc = (v: ReportForm) => {
    setReportForm(v);
    setPage(Page.CALCULATOR);
  };

  const navigateToForm = () => {
    setPage(Page.FORM);
  };

  const navigateToSVE = (d: IDeflators) => {
    const qp = new URLSearchParams();
    if (d.attribution) {
      qp.set("a", d.attribution.toString());
    }
    if (d.deadweight) {
      qp.set("dw", d.deadweight.toString());
    }
    if (d.dropOff) {
      qp.set("do", d.dropOff.toString());
    }
    const url = `https://www.socialvalueengine.com/deflators/import?${qp.toString()}`;
    window.location.href = url;
  };

  if (page === Page.CALCULATOR) {
    return (
      <SVECalculator
        onFormSubmit={navigateToSVE}
        config={reportForm}
        back={navigateToForm}
      />
    );
  }
  return (
    <RFComponent t={t} onFormSubmit={navigateToCalc} initial={reportForm} />
  );
};
const SVELimited = QuestionnaireRequired(SVEInner);
const SVE = PageWrapperHoC("Social Value Engine", "sve", SVELimited);
export { SVE };
