import * as React from 'react';
import {Form, Input, Icon} from 'semantic-ui-react';
import {getSelf, IGetSelf, IUpdateSelf, updateSelf} from 'apollo/modules/user';
import './style.less';
import {FormField} from 'components/FormField';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
const strings = require('./../../../strings.json');

interface IProps extends IUpdateSelf {
  self?: IGetSelf;
  additionalFields?: JSX.Element[];
}

interface IFormOutput {
  name: string;
  subscribed: boolean;
}

const InnerForm = (props: InjectedFormikProps<IProps, IFormOutput>) => {
  const { touched, error, errors, isSubmitting, submitForm, isValid, handleChange, handleBlur, values, dirty, handleReset } = props;
  const checkboxLabel = <label>Email me occasional updates from Impactasaurus</label>;
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.name as string} touched={touched.name} inputID="usf-name" label="Name" required={true}>
        <Input id="usf-name" name="name" type="text" placeholder="Your Name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
      </FormField>
      <FormField error={errors.subscribed as string} touched={touched.subscribed} inputID="usf-subscribe" label="Notifications">
        <Form.Checkbox id="usf-subscribe" name="subscribed" label={checkboxLabel} onChange={handleChange} checked={values.subscribed} />
      </FormField>
      {props.additionalFields}
      <Form.Group>
        <Form.Button disabled={!dirty} onClick={handleReset}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Save</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Editing the questionnaire failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

export const UserSettingsInner = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.name || values.name.length === 0) {
      errors.name = 'Please provide your name';
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setError(undefined);
    formikBag.setSubmitting(true);
    const vals = v as IFormOutput;
    formikBag.props.updateSelf(vals.name, !vals.subscribed)
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.setError(undefined);
        formikBag.resetForm(vals);
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    return {
      name: p.self.getSelf.profile.name,
      subscribed: !p.self.getSelf.settings.unsubscribed,
    };
  },
})(InnerForm);

const UserSettingsWithLoader = ApolloLoaderHoC('user', (p: IProps) => p.self, UserSettingsInner);
const UserSettings = updateSelf<IProps>(getSelf(UserSettingsWithLoader, 'self'));
export { UserSettings };
