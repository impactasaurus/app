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

interface IProps extends IOutcomeMutation, Partial<WithTranslation> {
  data?: IOutcomeResult;
  match?: {
    params: {
      id: string;
    };
  };
}

interface IFormOutput {
  name: string;
  description?: string;
  instructions?: string;
}

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
    t,
  } = props;
  const standardProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };
  const instructionLabel = (
    <span>
      <Hint
        text={t(
          "Instructions are shown to beneficiaries before they begin a questionnaire"
        )}
      />
      {t("Instructions")}
    </span>
  );
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
        label={instructionLabel}
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

const GeneralInner = withFormik<IProps, IFormOutput>({
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
        v.instructions
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
    };
  },
  validateOnMount: true,
})(InnerForm);

const GeneralTranslated = withTranslation()(GeneralInner);
export const General = editQuestionSet<IProps>(
  getOutcomeSet<IProps>((props) => props.match.params.id)(GeneralTranslated)
);
