import * as React from 'react';
import { Icon, Form } from 'semantic-ui-react';
import {Hint} from 'components/Hint';
import {FormField} from 'components/FormField';
import {FormikBag, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import {TagInputWithBenSuggestions} from 'components/TagInput';
const strings = require('./../../../strings.json');

export interface IFormOutput {
  tags: string[];
}

interface IProps {
  onFormSubmit: (IFormOutput) => Promise<any>;
  beneficiaryID: string;
  tags: string[];
  onCancel: () => void;
}

const InnerForm = (props: InjectedFormikProps<IProps, IFormOutput>) => {
  const {error, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values, beneficiaryID, onCancel, dirty} = props;

  const setTags = (tags: string[]) => {
    setFieldValue('tags', tags);
    setFieldTouched('tags');
  };

  const tagLabel = <span><Hint text={strings.beneficiaryTagExplanation} />Beneficiary Tags</span>;

  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField inputID="rf-tags" label={tagLabel} touched={true}>
        <TagInputWithBenSuggestions inputID="bf-tags" id={beneficiaryID} onChange={setTags} tags={values.tags} allowNewTags={true} />
      </FormField>
      <Form.Group>
        <Form.Button disabled={!dirty} onClick={onCancel}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Save</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Saving the beneficiary failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

export const BeneficiaryForm = withFormik<IProps, IFormOutput>({
  validate: () => {
    return {};
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setSubmitting(true);
    formikBag.props.onFormSubmit(v as IFormOutput)
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.setError(undefined);
        formikBag.resetForm();
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    return {
      tags: p.tags,
    };
  },
})(InnerForm);
