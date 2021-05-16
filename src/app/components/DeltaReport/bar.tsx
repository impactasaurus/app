import * as React from "react";
import { IBeneficiaryDeltaReport } from "models/report";
import { IOutcomeSet } from "models/outcomeSet";
import { StackedBarChart } from "components/BarChartStacked";
import { IBarChartData } from "models/bar";
import {
  getCategoryFriendlyName,
  getQuestionFriendlyName,
} from "helpers/questionnaire";
import { extractDeltas, IDelta } from "components/DeltaReport/data";
import { useTranslation } from "react-i18next";

interface IProp {
  report: IBeneficiaryDeltaReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

const getBarChartData = (
  t: (text: string) => string,
  category: boolean,
  report: IBeneficiaryDeltaReport,
  questionnaire: IOutcomeSet
): IBarChartData => {
  const data = extractDeltas(category, report, questionnaire);
  return data.reduce<IBarChartData>(
    (chart: IBarChartData, d: IDelta): IBarChartData => {
      const label = d.category
        ? getCategoryFriendlyName(d.id, questionnaire)
        : getQuestionFriendlyName(d.id, questionnaire);
      chart.labels.push(label);
      chart.series[0].data.push(d.decreased);
      chart.series[1].data.push(d.same);
      chart.series[2].data.push(d.increased);
      return chart;
    },
    {
      labels: [],
      series: [
        {
          data: [],
          label: t("Decreased"),
        },
        {
          data: [],
          label: t("Same"),
        },
        {
          data: [],
          label: t("Increased"),
        },
      ],
    }
  );
};

export const DeltaReportStackedBarGraph = (p: IProp): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="delta-report-stacked-bar-graph">
      <StackedBarChart
        data={getBarChartData(t, p.category, p.report, p.questionSet)}
        xAxisLabel={t("Beneficiaries")}
        showPercentage={false}
      />
    </div>
  );
};
