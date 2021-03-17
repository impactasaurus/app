import React from 'react';
import {Form, Input, Icon} from 'semantic-ui-react';
import {getSelf, IGetSelf, IUpdateSelf, updateSelf} from 'apollo/modules/user';
import {FormField} from 'components/FormField';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import './style.less';

interface IProps extends IUpdateSelf, Partial<WithTranslation> {
  self?: IGetSelf;
  additionalFields?: JSX.Element[];
}

interface IFormOutput {
  name: string;
  subscribed: boolean;
}

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const { touched, status, errors, isSubmitting, submitForm, isValid, handleChange, handleBlur, values, dirty, handleReset, t } = props;
  const checkboxLabel = <label>{t("Email me occasional updates from Impactasaurus")}</label>;
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.name as string} touched={touched.name} inputID="usf-name" label={t("Name")} required={true}>
        <Input id="usf-name" name="name" type="text" placeholder={t("Your Name")} onChange={handleChange} onBlur={handleBlur} value={values.name} />
      </FormField>
      <FormField error={errors.subscribed as string} touched={touched.subscribed} inputID="usf-subscribe" label={t("Notifications")}>
        <Form.Checkbox id="usf-subscribe" name="subscribed" label={checkboxLabel} onChange={handleChange} checked={values.subscribed} />
      </FormField>
      {props.additionalFields}
      <Form.Group>
        <Form.Button disabled={!dirty} onClick={handleReset}>{t("Cancel")}</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting}>{t("Save")}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />{t("Editing your user account failed.")} {t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}</span>}
    </Form>
  );
};

export const UserSettingsInner = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput, p: IProps) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.name || values.name.length === 0) {
      errors.name = p.t('Please provide your name');
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    const vals = v as IFormOutput;
    formikBag.props.updateSelf(vals.name, !vals.subscribed)
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.resetForm({values: vals});
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    return {
      name: p.self.getSelf.profile.name,
      subscribed: !p.self.getSelf.settings.unsubscribed,
    };
  },
  validateOnMount: true,
})(InnerForm);

const UserSettingsWithLoader = ApolloLoaderHoC('user', (p: IProps) => p.self, UserSettingsInner);
const UserSettingsWithTrans = withTranslation()(UserSettingsWithLoader);
const UserSettings = updateSelf<IProps>(getSelf(UserSettingsWithTrans, 'self'));
export { UserSettings };
