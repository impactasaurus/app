import * as React from 'react';
import { Select, Input, Form, Icon } from 'semantic-ui-react';
import {ICategoryMutation} from 'apollo/modules/categories';
import {IOutcomeSet} from 'models/outcomeSet';
import {FormField} from 'components/FormField';
import {FormikBag, FormikErrors, FormikValues, FormikProps, withFormik} from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';

export interface IQuestionCategory {
  name: string;
  description?: string;
  aggregation: string;
}

interface IProps extends ICategoryMutation, WithTranslation {
  values?: IQuestionCategory;
  OnCancel: ()=>void;
  OnSuccess: ()=>void;
  submitButtonText: string;
  onSubmitButtonPress: (name: string, aggregation: string, description: string)=>Promise<IOutcomeSet>;
}

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

const InnerForm = (props: IProps & FormikProps<IQuestionCategory>) => {
  const { touched, values, status, errors, isSubmitting, handleChange, OnCancel, dirty, t,
          submitForm, handleBlur, isValid, submitButtonText, setFieldValue, setFieldTouched } = props;

  const standardProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };

  const selectChanged = (_, d) => setFieldValue('aggregation', d.value);
  const selectBlur = () => setFieldTouched('aggregation', true);

  return (
    <Form className="question-category-form" onSubmit={submitForm} >
      <FormField error={errors.name as string} touched={touched.name} inputID="qcf-name" label={t("Name")} required={true}>
        <Input id="qcf-name" name="name" type="text" placeholder={t("Name")} value={values.name} {...standardProps} />
      </FormField>
      <FormField error={errors.description as string} touched={touched.description} inputID="qcf-description" label={t("Description")}>
        <Input id="qcf-description" name="description" type="text" placeholder={t("Description")} value={values.description} {...standardProps}/>
      </FormField>
      <FormField error={errors.aggregation as string} touched={touched.aggregation} inputID="qcf-agg" label={t("Aggregation")} required={true}>
        <Select id="qcf-agg" options={getAggregationOptions()} placeholder={t("Aggregation")} name="aggregation" value={values.aggregation} onChange={selectChanged} onBlur={selectBlur} />
      </FormField>

      <Form.Group>
        <Form.Button onClick={OnCancel}>{t("Cancel")}</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting}>{submitButtonText}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />
        {t("Saving the category failed.")} {t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}
      </span>}
    </Form>
  );
};

const QuestionCategoryFormInner = withFormik<IProps, IQuestionCategory>({
  validate: (values: IQuestionCategory, props: IProps) => {
    const t = props.t;
    const errors: FormikErrors<IQuestionCategory> = {};
    if (!values.name) {
      errors.name = t('Please enter a name for the category');
    }
    if (!values.aggregation) {
      errors.aggregation = t('Please select an aggregation');
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

export const QuestionCategoryForm = withTranslation()(QuestionCategoryFormInner);
