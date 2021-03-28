import React from 'react';
import { Icon, Form, Input } from 'semantic-ui-react';
import {FormField} from 'components/FormField';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import EmailValidator from 'email-validator';
import {withTranslation, WithTranslation, Trans} from 'react-i18next';

export interface IFormOutput {
  name: string;
  email: string;
  emailCopy: string;
  password: string;
  organisation: string;
  policyAcceptance: boolean;
}

interface IProps extends WithTranslation {
  onFormSubmit(v: IFormOutput): Promise<void>;
  collectOrgName?: boolean; // defaults to true
  initial?: IFormOutput;
}

const shouldCollectOrg = (p: IProps) => p.collectOrgName !== false;

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const { touched, status, errors, isSubmitting, submitForm, isValid, handleChange, handleBlur, values, t } = props;
  const termsLabel = (
    <label>
      <Trans
        defaults="I agree to the <termLink>Terms of Use</termLink>, <privacyLink>Privacy Policy</privacyLink> and <cookieLink>Cookie Policy</cookieLink>"
        components={{
          termLink: <a href="https://impactasaurus.org/terms" />,
          privacyLink: <a href="https://impactasaurus.org/privacy" />,
          cookieLink: <a href="https://impactasaurus.org/cookie" />
        }}
      />
    </label>
  );
  const signupVsInvite = t("If your organisation already has an account with Impactasaurus, please request an invite from your colleagues");
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.name as string} touched={touched.name} inputID="su-name" label={t("Name")} required={true}>
        <Input id="su-name" name="name" type="text" placeholder={t("Your Name")} onChange={handleChange} onBlur={handleBlur} value={values.name} />
      </FormField>
      <FormField error={errors.email as string} touched={touched.email} inputID="su-email" label={t("Email")} required={true}>
        <Input id="su-email" name="email" type="text" placeholder={t("Your Email")} onChange={handleChange} onBlur={handleBlur} value={values.email} />
      </FormField>
      <FormField error={errors.emailCopy as string} touched={touched.emailCopy} inputID="su-email-copy" label={t("Confirm Email")} required={true}>
        <Input id="su-email-copy" name="emailCopy" type="text" placeholder={t("Confirm Email")} onChange={handleChange} onBlur={handleBlur} value={values.emailCopy} />
      </FormField>
      <FormField error={errors.password as string} touched={touched.password} inputID="su-password" label={t("Password")} required={true}>
        <Input id="su-password" name="password" type="password" placeholder={t("Password")} onChange={handleChange} onBlur={handleBlur} value={values.password} />
      </FormField>
      {shouldCollectOrg(props) && (
        <FormField error={errors.organisation as string} touched={touched.organisation} inputID="su-organisation" label={t("Organisation's Name")} required={true} description={signupVsInvite}>
          <Input id="su-organisation" name="organisation" type="text" placeholder={t("Your Organisation's Name")} onChange={handleChange} onBlur={handleBlur} value={values.organisation} />
        </FormField>
      )}
      <Form.Group error={errors.policyAcceptance as string} style={{marginTop: '3em'}}>
        <Form.Checkbox id="su-policy" name="policyAcceptance" label={termsLabel} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{t("Get Started")}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />{status}</span>}
    </Form>
  );
};

const SignupFormInner = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput, p: IProps) => {
    const t = p.t;
    const errors: FormikErrors<IFormOutput> = {};
    if (values.policyAcceptance !== true) {
      errors.policyAcceptance = t('To use Impactasaurus you must accept the terms of use and privacy policy');
    }
    if (!values.name || values.name.length === 0) {
      errors.name = t('Please provide your name');
    }
    if (!values.email || values.email.length === 0) {
      errors.email = t('Please provide your email address');
    }
    if (values.email && !EmailValidator.validate(values.email)) {
      errors.email = t('Your email does not appear to be valid');
    }
    if (values.email !== values.emailCopy) {
      errors.emailCopy = t('The email addresses don\'t match');
    }
    if (!values.password || values.password.length === 0) {
      errors.password = t('Please provide a password');
    }
    if (values.password && values.password.length < 6) {
      errors.password = t('Passwords should be at least 6 characters long');
    }
    if (shouldCollectOrg(p) && (!values.organisation || values.organisation.length === 0)) {
      errors.organisation = t('Please provide your organisation\'s name');
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    formikBag.props.onFormSubmit(v as IFormOutput)
      .catch((e: Error) => {
        const t = formikBag.props.t;
        formikBag.setSubmitting(false);
        console.error(e);
        if (e.message.includes('already')) {
          formikBag.setStatus(t('User with email address {email} already exists', {email: v.email}));
        } else {
          const e1 = t("Signup failed.");
          const e2 = t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org");
          formikBag.setStatus(`${e1} ${e2}`);
        }
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    if (p.initial !== undefined && p.initial !== null) {
      return p.initial;
    }
    return {
      name: '',
      email: '',
      emailCopy: '',
      password: '',
      organisation: '',
      policyAcceptance: false,
    };
  },
  validateOnMount: true,
})(InnerForm);

export const SignupForm = withTranslation()(SignupFormInner);
