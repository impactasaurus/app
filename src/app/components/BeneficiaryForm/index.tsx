import * as React from 'react';
import { Icon, Form } from 'semantic-ui-react';
import {Hint} from 'components/Hint';
import {FormField} from 'components/FormField';
import {FormikBag, FormikValues, FormikProps, withFormik} from 'formik';
import {TagInputWithBenSuggestions} from 'components/TagInput';
import { WithTranslation, withTranslation } from 'react-i18next';

export interface IFormOutput {
  tags: string[];
}

interface IProps extends WithTranslation {
  onFormSubmit: (v: IFormOutput) => Promise<void>;
  beneficiaryID: string;
  tags: string[];
  onCancel: () => void;
}

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const {status, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values, beneficiaryID, onCancel, dirty, t} = props;

  const setTags = (tags: string[]) => {
    setFieldValue('tags', tags);
    setFieldTouched('tags');
  };

  const tagLabel = (
    <span>
      <Hint text={t("Beneficiary tags are automatically applied to all of the beneficiary's records. Tags are used to filter your records when reporting. Common uses of tags include demographic or location information.")} />
      {t("Beneficiary Tags")}
    </span>
  );

  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField inputID="rf-tags" label={tagLabel} touched={true}>
        <TagInputWithBenSuggestions inputID="bf-tags" id={beneficiaryID} onChange={setTags} tags={values.tags} allowNewTags={true} />
      </FormField>
      <Form.Group>
        <Form.Button disabled={!dirty} onClick={onCancel}>{t("Cancel")}</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting}>{t("Save")}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />{t("Saving the beneficiary failed.")} {t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}</span>}
    </Form>
  );
};

const BeneficiaryFormInner = withFormik<IProps, IFormOutput>({
  validate: () => {
    return {};
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    const vals = v as IFormOutput;
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props.onFormSubmit(vals)
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
      tags: p.tags,
    };
  },
  validateOnMount: true,
})(InnerForm);

const BeneficiaryForm = withTranslation()(BeneficiaryFormInner);
export {BeneficiaryForm};
