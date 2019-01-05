import * as React from 'react';
import { Icon, Form, Input } from 'semantic-ui-react';
import {FormField} from 'components/FormField';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import * as EmailValidator from 'email-validator';
const strings = require('./../../../strings.json');

export interface IFormOutput {
  name: string;
  email: string;
  password: string;
  organisation: string;
  policyAcceptance: boolean;
}

interface IProps {
  onFormSubmit(v: IFormOutput): Promise<void>;
  collectOrgName?: boolean; // defaults to true
  initial?: IFormOutput;
}

const shouldCollectOrg = (p: IProps) => p.collectOrgName !== false;

const InnerForm = (props: InjectedFormikProps<IProps, IFormOutput>) => {
  const { touched, error, errors, isSubmitting, submitForm, isValid, handleChange, handleBlur, values } = props;
  const termsLabel = <label>I agree to the <a href="https://impactasaurus.org/terms">Terms of Use</a>, <a href="https://impactasaurus.org/privacy">Privacy Policy</a> and <a href="https://impactasaurus.org/cookie">Cookie Policy</a></label>;
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.name as string} touched={touched.name} inputID="su-name" label="Name" required={true}>
        <Input id="su-name" name="name" type="text" placeholder="Your Name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
      </FormField>
      <FormField error={errors.email as string} touched={touched.email} inputID="su-email" label="Email" required={true}>
        <Input id="su-email" name="email" type="text" placeholder="Your Email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
      </FormField>
      <FormField error={errors.password as string} touched={touched.password} inputID="su-password" label="Password" required={true}>
        <Input id="su-password" name="password" type="password" placeholder="Password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
      </FormField>
      {shouldCollectOrg(props) && (
        <FormField error={errors.organisation as string} touched={touched.organisation} inputID="su-organisation" label="Organisation's Name" required={true} description={strings.signupVsInvite}>
          <Input id="su-organisation" name="organisation" type="text" placeholder="Your Organisation's Name" onChange={handleChange} onBlur={handleBlur} value={values.organisation} />
        </FormField>
      )}
      <Form.Group error={errors.policyAcceptance as string} style={{marginTop: '3em'}}>
        <Form.Checkbox id="su-policy" name="policyAcceptance" label={termsLabel} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Get Started</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />{error}</span>}
    </Form>
  );
};

export const SignupForm = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput, p: IProps) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (values.policyAcceptance !== true) {
      errors.policyAcceptance = 'To use Impactasaurus you must accept the terms of use and privacy policy' as any;
    }
    if (!values.name || values.name.length === 0) {
      errors.name = 'Please provide your name';
    }
    if (!values.email || values.email.length === 0) {
      errors.email = 'Please provide your email address';
    }
    if (values.email && !EmailValidator.validate(values.email)) {
      errors.email = 'Your email does not appear to be valid';
    }
    if (!values.password || values.password.length === 0) {
      errors.password = 'Please provide a password';
    }
    if (values.password && values.password.length < 6) {
      errors.password = 'Passwords should be at least 6 characters long';
    }
    if (shouldCollectOrg(p) && (!values.organisation || values.organisation.length === 0)) {
      errors.organisation = 'Please provide your organisation\'s name';
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setError(undefined);
    formikBag.setSubmitting(true);
    formikBag.props.onFormSubmit(v as IFormOutput)
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        console.error(e);
        if (e.message.includes('already')) {
          formikBag.setError(`User with email address ${v.email} already exists`);
        } else {
          formikBag.setError(`Signup failed. ${strings.formFailureGeneric}`);
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
      password: '',
      organisation: '',
      policyAcceptance: false,
    };
  },
})(InnerForm);
