import * as React from 'react';
import { Select, Input, Form, Icon } from 'semantic-ui-react';
import {ICategoryMutation} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';
import {FormField} from 'components/FormField';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
const formFailureGeneric = require('../../../strings.json').formFailureGeneric;

export interface IQuestionCategory {
  name: string;
  description?: string;
  aggregation: string;
}

interface IInnerFormProps {
  OnCancel: ()=>void;
  submitButtonText: string;
}

interface IExtProps extends IInnerFormProps {
  OnSuccess: ()=>void;
  onSubmitButtonPress: (name: string, aggregation: string, description: string)=>Promise<IOutcomeSet>;
  values?: IQuestionCategory;
}

interface IProps extends ICategoryMutation, IExtProps {}

const getAggregationOptions = () => {
  return [{
    key: 'mean',
    value: 'mean',
    text: 'Average',
  }, {
    key: 'sum',
    value: 'sum',
    text: 'Sum',
  }];
};

const InnerForm = (props: InjectedFormikProps<IInnerFormProps, IQuestionCategory>) => {
  const { touched, values, status, errors, isSubmitting, handleChange, OnCancel, dirty,
          submitForm, handleBlur, isValid, submitButtonText, setFieldValue, setFieldTouched } = props;

  const standardProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };

  const selectChanged = (_, d) => setFieldValue('aggregation', d.value);
  const selectBlur = () => setFieldTouched('aggregation', true);

  return (
    <Form className="question-category-form" onSubmit={submitForm} >
      <FormField error={errors.name as string} touched={touched.name} inputID="qcf-name" label="Name" required={true}>
        <Input id="qcf-name" name="name" type="text" placeholder="Name" value={values.name} {...standardProps} />
      </FormField>
      <FormField error={errors.description as string} touched={touched.description} inputID="qcf-description" label="Description">
        <Input id="qcf-description" name="description" type="text" placeholder="Description" value={values.description} {...standardProps}/>
      </FormField>
      <FormField error={errors.aggregation as string} touched={touched.aggregation} inputID="qcf-agg" label="Aggregation" required={true}>
        <Select id="qcf-agg" options={getAggregationOptions()} placeholder="Aggregation" name="aggregation" value={values.aggregation} onChange={selectChanged} onBlur={selectBlur} />
      </FormField>

      <Form.Group>
        <Form.Button onClick={OnCancel}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting}>{submitButtonText}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />Saving the category failed. {formFailureGeneric}</span>}
    </Form>
  );
};

export const QuestionCategoryForm = withFormik<IProps, IQuestionCategory>({
  validate: (values: IQuestionCategory) => {
    const errors: FormikErrors<IQuestionCategory> = {};
    if (!values.name) {
      errors.name = 'Please enter a name for the category';
    }
    if (!values.aggregation) {
      errors.aggregation = 'Please select an aggregation';
    }
    return errors;
  },

  mapPropsToValues: (p: IProps) => {
    return p.values || {
      name: "",
      aggregation: getAggregationOptions()[0].value,
    };
  },

  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IQuestionCategory>): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props.onSubmitButtonPress(v.name, v.aggregation, v.description)
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.props.OnSuccess();
      })
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e.message);
      });
  },
  validateOnMount: true,
})(InnerForm);
