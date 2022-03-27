import { TourContainer } from "components/TourContainer";
import { TourPointer } from "components/TourPointer";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { TourStage } from "redux/modules/tour";
import { Segment } from "semantic-ui-react";
import RocketIcon from "./../../theme/rocket.inline.svg";

interface IProps {
  id: string;
}

export const IntroduceReportPage = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t(
            "Reports provide insight over many beneficiaries. The report tab allows you to generate them"
          ),
          target: `#${p.id}`,
        },
      ]}
      stage={TourStage.REPORT_1}
      transitionOnLocationChange={TourStage.REPORT_2}
    />
  );
};

export const IntroduceReportForm = (p: {
  questionnaireID: string;
  questionnaireCompleted: boolean;
  dateRangeID: string;
  dateRangeCompleted: boolean;
  tagsID: string;
  tagsComplete: boolean;
  submitID: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t(
            "This form determines what records are included within the report, starting with the questionnaire. Select our ONS questionnaire"
          ),
          target: `#${p.questionnaireID}`,
          isComplete: p.questionnaireCompleted,
        },
        {
          content: t(
            "Next we pick the time range, only records within the given time range are included. Let's keep it as 'All'"
          ),
          target: `#${p.dateRangeID}`,
          isComplete: p.dateRangeCompleted,
        },
        {
          content: t(
            "Tags allow reports to be generated for a subset of your records, this could be based on demographics, location or type of intervention. As we have not added tags to our beneficiaries or records, we will leave this blank and include all records"
          ),
          target: `#${p.tagsID}`,
          isComplete: p.tagsComplete,
        },
        {
          content: t(
            "Now we have selected what we want included in the report, we can generate it"
          ),
          target: `#${p.submitID}`,
        },
      ]}
      stage={TourStage.REPORT_2}
      transitionOnUnmount={TourStage.REPORT_3}
    />
  );
};

export const EndOfReportTour = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourContainer stage={TourStage.REPORT_3} transitionOnUnmount={null}>
      <Segment
        raised={true}
        compact={true}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <h3 style={{ fontWeight: "normal" }}>
          <RocketIcon style={{ width: "1rem", marginRight: ".3rem" }} />
          {t("What next?")}
        </h3>
        <p>
          {t(
            "This is your generated report - when you have more data, it will provide insight over many beneficiaries."
          )}
        </p>
        <p>
          {t(
            "The tabs above allow you to look at the data in multiple ways. Distance travelled and beneficiary change rely on multiple records per beneficiary, whilst the status report supports cross sectional studies with only one record per beneficiary."
          )}
        </p>
        <p>
          <Trans
            defaults="Congratulations, you now know the major features of Impactasaurus. If you need any further help getting started, please drop us an email at <email>support@impactasaurus.org</email>."
            components={{
              email: (
                <a href="mailto:support@impactasaurus.org?Subject=Getting%20Started" />
              ),
            }}
          />
        </p>
      </Segment>
    </TourContainer>
  );
};
