import React from "react";
import { FormField } from "components/FormField";
import { Hint } from "components/Hint";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";

interface IProps {
  license?: string;
  attribution?: string;
  questionnaire: IOutcomeSet;
}

export const QuestionnaireGeneral = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Form className="screen">
      <FormField touched={false} inputID="qg-name" label={t("Name")}>
        <span>{p.questionnaire.name}</span>
      </FormField>
      <FormField
        touched={false}
        inputID="qg-description"
        label={t("Description")}
      >
        <span>{p.questionnaire.description}</span>
      </FormField>
      {p.license && (
        <FormField touched={false} inputID="qg-license" label={t("License")}>
          <span>{p.license}</span>
        </FormField>
      )}
      {p.attribution && (
        <FormField touched={false} inputID="qg-attr" label={t("Attribution")}>
          <span>{p.attribution}</span>
        </FormField>
      )}
      <FormField
        touched={false}
        inputID="qg-instructions"
        label={
          <span>
            <Hint
              text={t(
                "Instructions are shown to beneficiaries before they begin a questionnaire"
              )}
            />
            {t("Instructions")}
          </span>
        }
      >
        <span>{p.questionnaire.instructions}</span>
      </FormField>
    </Form>
  );
};
