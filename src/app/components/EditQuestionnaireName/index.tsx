import * as React from 'react';
import {Input, Icon, Form} from 'semantic-ui-react';
import { editQuestionSet, IOutcomeMutation } from 'apollo/modules/outcomeSets';
import { IOutcomeResult } from '../../apollo/modules/outcomeSets';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import {FormField} from 'components/FormField';
import {IOutcomeSet} from '../../models/outcomeSet';
import './style.less';
const formFailureGeneric = require('../../../strings.json').formFailureGeneric;

interface IExternalProps {
  outcomeSetID: string;
  afterSubmit: ()=>void;
}

interface IProps extends IOutcomeMutation, IExternalProps {
  data?: IOutcomeResult;
}

const InnerForm = (props: InjectedFormikProps<any, IOutcomeSet>) => {
  const { touched, error, errors, isSubmitting, handleChange, submitForm, handleBlur, isValid, values } = props;
  const onCancel = (values as any).onCancel;

  return (
    <Form className="edit-control questionnaire name" onSubmit={submitForm} >
      <FormField error={errors.name as string} touched={touched.name} inputID="eqf-name" label="Name" required={true}>
        <Input id="eqf-name" value={values.name} name="name" type="text" placeholder="Name" onChange={handleChange} onBlur={handleBlur} />
      </FormField>
      <Form.Group>
        <Form.Button onClick={onCancel}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Create</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Editing the questionnaire failed. {formFailureGeneric}</span>}
    </Form>
  );
};

const EditQuestionnaireNameInner = withFormik<IProps, IOutcomeSet>({
  validate: (values: IOutcomeSet) => {
    const errors: FormikErrors<IOutcomeSet> = {};
    if (!values.name) {
      errors.name = 'Please enter a new name for the questionnaire';
    }
    return errors;
  },

  mapPropsToValues: (p: IProps) => {
    return {
      ...p.data.getOutcomeSet,
      onCancel: p.afterSubmit,
    };
  },

  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IOutcomeSet>): void => {
    formikBag.setSubmitting(true);
    formikBag.setError(undefined);
    formikBag.props.editQuestionSet(
      formikBag.props.outcomeSetID,
      v.name,
      formikBag.props.data.getOutcomeSet.description,
      formikBag.props.data.getOutcomeSet.instructions,
    )
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.props.afterSubmit();
      })
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e.message);
      });
  },
})(InnerForm);

export const EditQuestionnaireName = editQuestionSet<IProps>(EditQuestionnaireNameInner);
