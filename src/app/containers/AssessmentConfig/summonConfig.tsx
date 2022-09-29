import React from "react";
import { Icon, Form } from "semantic-ui-react";
import { FormField } from "components/FormField";
import { QuestionnaireSelect } from "components/QuestionnaireSelect/pref";
import {
  FormikBag,
  FormikErrors,
  FormikProps,
  FormikValues,
  withFormik,
} from "formik";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionnairishType } from "components/QuestionnairesAndSequencesHoC";

interface IProps extends WithTranslation {
  onSubmit: (c: ISummonConfig) => Promise<void>;
  buttonText: string;
}

export interface ISummonConfig {
  qishID: string;
  qishType: QuestionnairishType;
}

const InnerForm = (props: FormikProps<ISummonConfig> & IProps) => {
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
  const qsOnChange = (qsID: string, type: QuestionnairishType) => {
    if (qsID !== values.qishID) {
      setFieldValue("qishID", qsID);
      setFieldValue("qishType", type);
    }
  };

  return (
    <Form className="screen assessment-config" onSubmit={submitForm}>
      <FormField
        error={errors.qishID as string}
        touched={touched.qishID}
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

const SummonConfigInner = withFormik<IProps, ISummonConfig>({
  validate: (values: ISummonConfig, p: IProps) => {
    const errors: FormikErrors<ISummonConfig> = {};
    if (!values.qishID || values.qishID === "") {
      errors.qishID = p.t("Please select a questionnaire");
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, ISummonConfig>
  ): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    formikBag.props
      .onSubmit({
        qishID: v.qishID,
        qishType: v.qishType,
      })
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
