import * as React from 'react';
import {ButtonProps, Form, Input, Icon} from 'semantic-ui-react';
import './style.less';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import {FormField} from 'components/FormField';
import { WithTranslation, withTranslation } from 'react-i18next';

export interface INewQuestionnaire {
  name: string;
  description: string;
}

interface IProps extends WithTranslation {
  submit: (INewQuestionnaire) => Promise<void>;
  onCancel: () => void;
}

const InnerForm = (props: IProps & FormikProps<INewQuestionnaire>) => {
  const { touched, status, errors, isSubmitting, handleChange, onCancel, submitForm, handleBlur, isValid, t } = props;
  const submitProps: ButtonProps = {};
  if (isSubmitting) {
    submitProps.loading = true;
    submitProps.disabled = true;
  }

  return (
    <Form className="new-questionnaire-form" onSubmit={submitForm} >
      <FormField error={errors.name as string} touched={touched.name} inputID="nqf-name" label={t("Name")} required={true}>
        <Input id="nqf-name" name="name" type="text" placeholder={t("Name")} onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <FormField error={errors.description as string} touched={touched.description} inputID="nqf-description" label={t("Description")}>
        <Input id="nqf-description" name="description" type="text" placeholder={t("Description")} onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <Form.Group>
        <Form.Button type="reset" onClick={onCancel}>{t("Cancel")}</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} {...submitProps}>{t("Create")}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />{t("Creating the questionnaire failed.")} {t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}</span>}
    </Form>
  );
};

const NewQuestionnaireFormInner = withFormik<IProps, INewQuestionnaire>({
  validate: (values: INewQuestionnaire, props: IProps) => {
    const t = props.t;
    const errors: FormikErrors<INewQuestionnaire> = {};
    if (!values.name) {
      errors.name = t('Please enter a name for the new questionnaire');
    }
    return errors;
  },

  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, INewQuestionnaire>): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props.submit(v)
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e.message);
      });
  },
  validateOnMount: true,
})(InnerForm);

const NewQuestionnaireForm = withTranslation()(NewQuestionnaireFormInner);
export {NewQuestionnaireForm};
