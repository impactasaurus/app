import React from "react";
import { AssessmentType, IAssessmentConfig } from "models/assessment";
import { useTranslation } from "react-i18next";
import { Button, Message } from "semantic-ui-react";
import { SummonConfig as RawSummonConfig } from "./summonConfig";
import { AssessmentConfig as AssessmentConfigComponent } from "components/AssessmentConfig";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";
import { useLocation } from "react-router";
const ConfigComponent = QuestionnaireRequired(AssessmentConfigComponent);
const SummonConfig = QuestionnaireRequired(RawSummonConfig);

interface IProps {
  type: AssessmentType;
  onChangeType: (next: AssessmentType) => void;
  start: (config: IAssessmentConfig | string) => Promise<void>;
}

const getBen = (search: string): string | undefined => {
  const urlParams = new URLSearchParams(search);
  return urlParams.has("ben") ? urlParams.get("ben") : undefined;
};

export const AssessmentConfigForm = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const { search } = useLocation();

  const showRemoteTypeSelector =
    p.type === AssessmentType.remote || p.type === AssessmentType.summon;
  const showAssessmentConfig = p.type !== AssessmentType.summon;
  const showSummonConfig = p.type === AssessmentType.summon;
  const buttonText = showRemoteTypeSelector ? t("Generate Link") : t("Start");
  const shouldGetDate = p.type === AssessmentType.historic;

  return (
    <div>
      {showRemoteTypeSelector && (
        <div
          key="remote-type-select"
          style={{
            marginBottom: "2em",
          }}
        >
          <Button.Group>
            <Button
              key="remote"
              active={p.type === AssessmentType.remote}
              onClick={() => p.onChangeType(AssessmentType.remote)}
            >
              {t("Single Beneficiary")}
            </Button>
            <Button.Or key="or" text={t<string>("or")} />
            <Button
              key="summon"
              active={p.type === AssessmentType.summon}
              onClick={() => p.onChangeType(AssessmentType.summon)}
            >
              {t("Multiple Beneficiaries")}
            </Button>
          </Button.Group>
        </div>
      )}
      {showAssessmentConfig && (
        <div key="assessment-config">
          <ConfigComponent
            defaultBen={getBen(search)}
            showDatePicker={shouldGetDate}
            onSubmit={p.start}
            buttonText={buttonText}
          />
        </div>
      )}
      {showSummonConfig && (
        <div key="summon-config">
          <Message info={true}>
            <p>
              {t(
                "Beneficiaries will be asked for their beneficiary ID before they answer the questionnaire. When sending the link, ensure that your beneficiaries know what ID they should be using."
              )}
            </p>
            <p>
              {t(
                "As beneficiary IDs are provided by the recipient of the link, there is potential for abuse. If your beneficiaries know each others IDs, they could answer the questionnaire pretending to be another beneficiary. In this case, you should use single beneficiary links instead."
              )}
            </p>
          </Message>
          <SummonConfig buttonText={buttonText} onSubmit={p.start} />
        </div>
      )}
    </div>
  );
};
