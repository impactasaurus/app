import React from 'react';
import { Form } from 'semantic-ui-react';
import {BeneficiaryInput} from 'components/BeneficiaryInput';
import {FormField} from 'components/FormField';
import { IURLConnector, UrlHOC } from 'redux/modules/url';
import { Hint } from 'components/Hint';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import { PageWrapperHoC } from 'components/PageWrapperHoC';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IFormOutput {
  beneficiaryID: string;
  existing?: boolean;
}

interface IFormProps extends WithTranslation {
  onBeneficiarySelect(benID: string, newBen: boolean|undefined): void;
}

const InnerForm = (props: FormikProps<IFormOutput> & IFormProps) => {
  const { touched, errors, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values, t } = props;
  const onChange = (benID: string, existing: boolean|undefined) => {
    setFieldValue('beneficiaryID', benID);
    setFieldValue('existing', existing);
  };
  const onBlur = () => setFieldTouched('beneficiaryID');
  const label = (
    <span>
      <Hint text={t("Beneficiary identifiers should not contain personal information. Ideally this would be the ID of the beneficiary within your other systems (e.g. CRM)")} />
      {t("New or Existing Beneficiary")}
    </span>
  );
  let submitText = t('Submit');
  if (values.existing !== undefined) {
    submitText = values.existing ? t('View') : t('Create');
  }
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.beneficiaryID as string} touched={touched.beneficiaryID} inputID="rsf-ben" required={true} label={label}>
        <BeneficiaryInput inputID="rsf-ben" onChange={onChange} onBlur={onBlur} allowUnknown={true}/>
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{submitText}</Form.Button>
      </Form.Group>
    </Form>
  );
};

const BeneficairyFormInner = withFormik<IFormProps, IFormOutput>({
  validate: (values: IFormOutput, p: IFormProps) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.beneficiaryID) {
      errors.beneficiaryID = p.t('Please select a beneficiary');
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IFormProps, IFormOutput>): void => {
    formikBag.setSubmitting(true);
    formikBag.props.onBeneficiarySelect(v.beneficiaryID, v.existing === false);
  },
})(InnerForm);

const BeneficairyForm = withTranslation()(BeneficairyFormInner);

const BeneficiarySelectorInner = (p: IURLConnector) => {

  const review = (benID: string, newBen: boolean) => {
    let url = `/beneficiary/${benID}`;
    if (newBen) {
      url = url + '/record';
    }
    p.setURL(url, `?ben=${benID}`);
  }

  return (
    <BeneficairyForm onBeneficiarySelect={review} />
  );
};

// t('Beneficiary')
const BeneficiarySelectorPage = PageWrapperHoC("Beneficiary", "reviewselector", BeneficiarySelectorInner);
const BeneficiarySelector = UrlHOC(BeneficiarySelectorPage);
export { BeneficiarySelector };
