import * as React from "react";
import {
  IOutcomeResult,
  getOutcomeSet,
  IOutcomeMutation,
  editQuestionSet,
} from "apollo/modules/outcomeSets";
import { FormField } from "components/FormField";
import { Icon, Input, Form, TextArea } from "semantic-ui-react";
import { Hint } from "components/Hint";
import {
  FormikBag,
  FormikErrors,
  FormikValues,
  FormikProps,
  withFormik,
} from "formik";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionnaireGeneral } from "components/QuestionnaireGeneral";
import { IWithNotes } from "models/question";

interface IProps extends IOutcomeMutation, Partial<WithTranslation> {
  data?: IOutcomeResult;
  match?: {
    params: {
      id: string;
    };
  };
}

interface IFormOutput extends IWithNotes {
  name: string;
  description?: string;
  instructions?: string;
}

const LabelAndHint = (p: {
  label: string;
  hint: string;
  style?: React.CSSProperties;
}) => (
  <span style={p.style}>
    <Hint text={p.hint} />
    {p.label}
  </span>
);

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const {
    touched,
    status,
    errors,
    isSubmitting,
    values,
    submitForm,
    isValid,
    handleChange,
    handleBlur,
    handleReset,
    dirty,
    setFieldValue,
    t,
  } = props;
  const standardProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField
        error={errors.name as string}
        touched={touched.name}
        inputID="qg-name"
        required={true}
        label={t("Name")}
      >
        <Input
          id="qg-name"
          name="name"
          type="text"
          placeholder={t("Name")}
          value={values.name}
          {...standardProps}
        />
      </FormField>
      <FormField
        error={errors.description as string}
        touched={touched.description}
        inputID="qg-description"
        label={t("Description")}
      >
        <Input
          id="qg-description"
          name="description"
          type="text"
          placeholder={t("Description")}
          value={values.description}
          {...standardProps}
        />
      </FormField>
      <FormField
        error={errors.instructions as string}
        touched={touched.instructions}
        inputID="qg-instructions"
        label={
          <LabelAndHint
            label={t("Instructions")}
            hint={t(
              "Instructions are shown to beneficiaries before they begin a questionnaire"
            )}
          />
        }
      >
        <TextArea
          id="qg-instructions"
          name="instructions"
          type="text"
          placeholder={t("Instructions")}
          value={values.instructions}
          autoHeight={true}
          {...standardProps}
        />
      </FormField>
      <FormField
        error={undefined}
        touched={false}
        inputID="qg-comments"
        label={
          <LabelAndHint
            label={t("Comments")}
            hint={t(
              "A text box can be provided at the end of the questionnaire to gather comments from the beneficiary or facilitator"
            )}
          />
        }
      >
        <Form.Checkbox
          id="note-active"
          name="noteDeactivated"
          label={t("Include comment box")}
          checked={!values.noteDeactivated}
          onChange={() =>
            setFieldValue("noteDeactivated", !values.noteDeactivated)
          }
        />
        {!values.noteDeactivated && (
          <>
            <Form.Checkbox
              id="note-required"
              name="noteRequired"
              label={t("Require a comment to be entered")}
              checked={values.noteRequired}
              {...standardProps}
            />
            <div style={{ marginBottom: "0.5em" }}>
              <LabelAndHint
                hint={t("Explains what should be written in the text box")}
                label={t("Comment prompt") + ":"}
              />
            </div>
            <TextArea
              id="lqf-noteprompt"
              name="notePrompt"
              type="text"
              placeholder={t(
                "Defaults to 'Record any additional comments, goals or actions'"
              )}
              value={values.notePrompt}
              {...standardProps}
            />
          </>
        )}
      </FormField>
      <Form.Group>
        <Form.Button type="reset" disabled={!dirty} onClick={handleReset}>
          {t("Cancel")}
        </Form.Button>
        <Form.Button
          type="submit"
          primary={true}
          disabled={!dirty || !isValid || isSubmitting}
          loading={isSubmitting}
        >
          {t("Save")}
        </Form.Button>
      </Form.Group>
      {status && (
        <span className="submit-error">
          <Icon name="exclamation" />
          {t("Editing the questionnaire failed.")}{" "}
          {t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </span>
      )}
    </Form>
  );
};

const Editable = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.name || values.name === "") {
      errors.name = "Please give the questionnaire a name";
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, IFormOutput>
  ): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props
      .editQuestionSet(
        formikBag.props.match.params.id,
        v.name,
        v.description,
        v.instructions,
        {
          noteDeactivated: v.noteDeactivated,
          notePrompt: v.notePrompt,
          noteRequired: v.noteRequired,
        }
      )
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.resetForm({ values: v as IFormOutput });
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    if (p.data.loading || p.data.getOutcomeSet === undefined) {
      return {
        name: "",
      };
    }
    const os = p.data.getOutcomeSet;
    return {
      name: os.name,
      description: os.description || "",
      instructions: os.instructions || "",
      noteDeactivated: os.noteDeactivated,
      notePrompt: os.notePrompt || "",
      noteRequired: os.noteRequired,
    };
  },
  validateOnMount: true,
})(InnerForm);

const ReadOnly = (p: IProps) => (
  <QuestionnaireGeneral questionnaire={p.data.getOutcomeSet} />
);

const GeneralInner = (p: IProps) => {
  return p.data.getOutcomeSet?.readOnly === true ? (
    <ReadOnly {...p} />
  ) : (
    <Editable {...p} />
  );
};

const GeneralTranslated = withTranslation()(GeneralInner);
export const General = editQuestionSet<IProps>(
  getOutcomeSet<IProps>((props) => props.match.params.id)(GeneralTranslated)
);
