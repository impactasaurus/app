import * as React from 'react';
import { Radio, Icon, Form } from 'semantic-ui-react';
import {DateRangePicker} from 'components/DateRangePicker';
import {Hint} from 'components/Hint';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {FormField} from 'components/FormField';
import './style.less';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import {RecordTagInputWithQuestionnaireSuggestions} from 'components/RecordTagInputWithSuggestions';
const strings = require('./../../../strings.json');

export interface IFormOutput {
  questionSetID: string;
  all: boolean;
  start?: Date;
  end?: Date;
  tags: string[];
}

interface IProps {
  onFormSubmit(v: IFormOutput): void;
}

const InnerForm = (props: InjectedFormikProps<any, IFormOutput>) => {
  const { touched, error, errors, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values } = props;

  const qsOnBlur = () => setFieldTouched('questionSetID');
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.questionSetID) {
      setFieldValue('questionSetID', qsID);
    }
  };
  const allOnChange = (toSet: boolean) => () => {
    setFieldValue('all', toSet);
    setFieldTouched('all');
  };
  const setDateRange = (start: Date|null, end: Date|null): void => {
    setFieldValue('start', start);
    setFieldValue('end', end);
    setFieldTouched('start');
    setFieldTouched('end');
  };
  const setTags = (tags: string[]) => {
    setFieldValue('tags', tags);
    setFieldTouched('tags');
  };

  const dateRangeStyle = {} as any;
  if (values.all) {
    dateRangeStyle.display = 'none';
  }

  const label = <span><Hint text={strings.tagUsage} />Tags</span>;

  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.questionSetID} touched={touched.questionSetID} inputID="rf-qid" required={true} label="Questionnaire">
        <QuestionSetSelect inputID="rf-qid" onQuestionSetSelected={qsOnChange} onBlur={qsOnBlur} />
      </FormField>
      <FormField label="Included Records" required={true} inputID="filter-options" error={errors.all as string} touched={touched.all}>
        <div id="filter-options">
          <Radio checked={values.all === true} onChange={allOnChange(true)} label="All" />
          <Radio checked={values.all === false} onChange={allOnChange(false)} label="Date Range"/>
        </div>
      </FormField>
      <div style={dateRangeStyle}>
        <FormField  label="Date Range" required={true} inputID="rf-date-picker" error={errors.start as string || errors.end as string} touched={touched.end as boolean || touched.start as boolean}>
          <div id="rf-date-picker">
            <DateRangePicker onSelectUnfiltered={setDateRange} future={false}/>
          </div>
        </FormField>
      </div>
      <FormField inputID="rf-tags" label={label} touched={touched.tags as boolean} error={errors.tags as string}>
        <RecordTagInputWithQuestionnaireSuggestions inputID="rf-tags" id={values.questionSetID} onChange={setTags} tags={values.tags} allowNewTags={false} />
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Generate</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Generating the report failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

export const ReportForm = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.questionSetID || values.questionSetID === '') {
      errors.questionSetID = 'Please select a questionnaire';
    }
    const noTimeRange = !values.start || !values.end;
    if (!values.all && noTimeRange) {
      errors.start = 'Please select a time range' as any;
    }
    if (!values.all && values.start >= values.end) {
      errors.start = 'Please select a valid time range' as any;
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setSubmitting(true);
    formikBag.props.onFormSubmit(v as IFormOutput);
  },
  mapPropsToValues: (_: IProps): IFormOutput => {
    return {
      questionSetID: '',
      all: true,
      tags: [],
    };
  },
})(InnerForm);
