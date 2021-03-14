import React from 'react';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import {FormField} from 'components/FormField';
import {Form, Input, Icon } from 'semantic-ui-react';
import {WithTranslation, withTranslation} from 'react-i18next';

interface IFormOuput {
  beneficiaryID: string;
}

interface IFormProps extends WithTranslation {
  onBeneficiarySelect(benID: string): Promise<void>;
}

const InnerForm = (props: IFormProps & FormikProps<IFormOuput>) => {
  const { touched, status, errors, isSubmitting, submitForm, isValid, handleChange, handleBlur, t } = props;
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.beneficiaryID as string} touched={touched.beneficiaryID} inputID="smn-ben" required={true} label={t("Your ID")}>
        <Input type="text" id="beneficiaryID" placeholder="ID" onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{t("Start")}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />{status}</span>}
    </Form>
  );
};

const SummonFormInner = withFormik<IFormProps, IFormOuput>({
  validate: (values: IFormOuput, p: IFormProps) => {
    const errors: FormikErrors<IFormOuput> = {};
    if (!values.beneficiaryID) {
      errors.beneficiaryID = p.t('Please enter your ID');
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IFormProps, IFormOuput>): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props.onBeneficiarySelect(v.beneficiaryID)
      .then(() => {
        // will move on from this component so no need to do anything
      })
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e.message);
      });
  },
  validateOnMount: true,
})(InnerForm);

export const SummonForm = withTranslation()(SummonFormInner);
