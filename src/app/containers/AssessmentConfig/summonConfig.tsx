import * as React from 'react';
import { Icon, Form } from 'semantic-ui-react';
import {FormField} from 'components/FormField';
import {IAssessmentConfig} from 'models/assessment';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
const strings = require('./../../../strings.json');

interface IProps  {
  onSubmit: (qsID: string) => Promise<void>;
  buttonText: string;
}

const InnerForm = (props: InjectedFormikProps<IProps, IAssessmentConfig>) => {
  const { touched, status, errors, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values } = props;

  const qsOnBlur = () => setFieldTouched('outcomeSetID');
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.outcomeSetID) {
      setFieldValue('outcomeSetID', qsID);
    }
  };

  return (
    <Form className="screen assessment-config" onSubmit={submitForm}>
      <FormField error={errors.outcomeSetID as string} touched={touched.outcomeSetID} inputID="as-qid" required={true} label="Questionnaire">
        <QuestionSetSelect inputID="as-qid" onQuestionSetSelected={qsOnChange} onBlur={qsOnBlur} />
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{props.buttonText}</Form.Button>
      </Form.Group>
      {status && <span className="submit-error"><Icon name="exclamation" />Starting the assessment failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

export const SummonConfig = withFormik<IProps, IAssessmentConfig>({
  validate: (values: IAssessmentConfig) => {
    const errors: FormikErrors<IAssessmentConfig> = {};
    if (!values.outcomeSetID || values.outcomeSetID === '') {
      errors.outcomeSetID = 'Please select a questionnaire';
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IAssessmentConfig>): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    formikBag.props.onSubmit(v.outcomeSetID)
      .then(() => {
        // will move on from this component so no need to do anything
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e);
      });
  },
  validateOnMount: true,
})(InnerForm);
