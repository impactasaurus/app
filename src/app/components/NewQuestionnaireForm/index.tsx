import * as React from 'react';
import {ButtonProps, Form, Input, Icon} from 'semantic-ui-react';
import './style.less';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import {FormField} from 'components/FormField';

export interface INewQuestionnaire {
  name: string;
  description: string;
}

interface IProps extends IOnCancel {
  submit: (INewQuestionnaire) => Promise<any>;
}

interface IOnCancel {
  onCancel: () => void;
}

const InnerForm = (props: InjectedFormikProps<IOnCancel, INewQuestionnaire>) => {
  const { error, errors, isSubmitting, handleChange, onCancel, submitForm, handleBlur, isValid } = props;
  const submitProps: ButtonProps = {};
  if (isSubmitting) {
    submitProps.loading = true;
    submitProps.disabled = true;
  }

  return (
    <Form className="new-questionnaire-form" onSubmit={submitForm} >
      <FormField error={errors.name as string} inputID="nqf-name" label="Name">
        <Input id="nqf-name" name="name" type="text" placeholder="Name" onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <FormField error={errors.description as string} inputID="nqf-description" label="Description">
        <Input id="nqf-description" name="description" type="text" placeholder="Description" onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <Form.Group>
        <Form.Button onClick={onCancel}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid} {...submitProps}>Create</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Creating the questionnaire failed. Please refresh and try again, if that doesn't get it, please drop us an email at support@impactasaurus.org</span>}
    </Form>
  );
};

const NewQuestionnaireForm = withFormik<IProps, INewQuestionnaire>({
  validate: (values: INewQuestionnaire) => {
    const errors: FormikErrors<INewQuestionnaire> = {};
    if (!values.name) {
      errors.name = 'Please enter a name for the new questionnaire';
    }
    return errors;
  },

  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, INewQuestionnaire>): void => {
    formikBag.setSubmitting(true);
    formikBag.setError(undefined);
    formikBag.props.submit(v)
      .then(() => {
        formikBag.setSubmitting(false);
      })
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e.message);
      });
  },
})(InnerForm);

export {NewQuestionnaireForm};
