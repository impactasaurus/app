import React from "react";
import { Icon, Form } from "semantic-ui-react";
import { FormField } from "components/FormField";
import { IAssessmentConfig } from "models/assessment";
import { QuestionnaireSelect } from "components/QuestionnaireSelect/pref";
import {
  FormikBag,
  FormikErrors,
  FormikProps,
  FormikValues,
  withFormik,
} from "formik";
import { WithTranslation, withTranslation } from "react-i18next";

interface IProps extends WithTranslation {
  onSubmit: (qsID: string) => Promise<void>;
  buttonText: string;
}

const InnerForm = (props: FormikProps<IAssessmentConfig> & IProps) => {
  const {
    touched,
    status,
    errors,
    isSubmitting,
    setFieldValue,
    submitForm,
    setFieldTouched,
    isValid,
    values,
    t,
  } = props;

  const qsOnBlur = () => setFieldTouched("outcomeSetID");
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.outcomeSetID) {
      setFieldValue("outcomeSetID", qsID);
    }
  };

  return (
    <Form className="screen assessment-config" onSubmit={submitForm}>
      <FormField
        error={errors.outcomeSetID as string}
        touched={touched.outcomeSetID}
        inputID="as-qid"
        required={true}
        label={t("Questionnaire")}
      >
        <QuestionnaireSelect
          inputID="as-qid"
          onQuestionnaireSelected={qsOnChange}
          onBlur={qsOnBlur}
          autoSelectFirst={true}
          includeSequences={true}
        />
      </FormField>
      <Form.Group>
        <Form.Button
          type="submit"
          primary={true}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          {props.buttonText}
        </Form.Button>
      </Form.Group>
      {status && (
        <span className="submit-error">
          <Icon name="exclamation" />
          {t("Starting the assessment failed.")}{" "}
          {t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </span>
      )}
    </Form>
  );
};

const SummonConfigInner = withFormik<IProps, IAssessmentConfig>({
  validate: (values: IAssessmentConfig, p: IProps) => {
    const errors: FormikErrors<IAssessmentConfig> = {};
    if (!values.outcomeSetID || values.outcomeSetID === "") {
      errors.outcomeSetID = p.t("Please select a questionnaire");
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, IAssessmentConfig>
  ): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    formikBag.props
      .onSubmit(v.outcomeSetID)
      .then(() => {
        // will move on from this component so no need to do anything
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e);
      });
  },
  validateOnMount: true,
})(InnerForm);

export const SummonConfig = withTranslation()(SummonConfigInner);
