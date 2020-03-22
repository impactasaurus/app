import * as React from 'react';
import { Icon, Form } from 'semantic-ui-react';
import {DateTimePicker} from 'components/DateTimePicker';
import {Hint} from 'components/Hint';
import {TagInputWithBenSuggestions} from 'components/TagInput';
import {BeneficiaryInput} from 'components/BeneficiaryInput';
import {FormField} from 'components/FormField';
import {IAssessmentConfig} from 'models/assessment';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {BeneficiaryTags} from 'components/BeneficiaryTags';
import * as moment from 'moment';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
import './style.less';
const strings = require('./../../../strings.json');

interface IProps  {
  showDatePicker: boolean;
  buttonText: string;
  onSubmit: (config: IAssessmentConfig) => Promise<void>;
  defaultBen?: string;
}

interface IAssessmentConfigAndDebounce extends IAssessmentConfig {
  debouncedBenID?: string;
  defaultBen?: string;
}

interface InnerFormProps {
  showDatePicker: boolean;
  buttonText: string;
}

const InnerForm = (props: InjectedFormikProps<InnerFormProps, IAssessmentConfigAndDebounce>) => {
  const { touched, error, errors, isSubmitting, setFieldValue, submitForm, setFieldTouched, isValid, values } = props;

  const qsOnBlur = () => setFieldTouched('outcomeSetID');
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.outcomeSetID) {
      setFieldValue('outcomeSetID', qsID);
    }
  };
  const setConductedDate = (date: moment.Moment) => {
    setFieldValue('date', date.toDate());
    setFieldTouched('date');
  };
  const setTags = (tags: string[]) => {
    setFieldValue('tags', tags);
    setFieldTouched('tags');
  };

  const datePickerStyle = {} as any;
  if (!props.showDatePicker) {
    datePickerStyle.display = 'none';
  }

  const onBenChange = (benID: string) => setFieldValue('beneficiaryID', benID);
  const onBenBlur = (benID: string) => {
    setFieldTouched('beneficiaryID');
    setFieldTouched('debouncedBenID');
    setFieldValue('debouncedBenID', benID);
  };
  const onBenFocus = () => {
    setFieldValue('debouncedBenID', undefined);
  };

  const benLabel = <span><Hint text={strings.beneficiaryIDExplanation} />New or Existing Beneficiary</span>;
  const tagLabel = <span><Hint text={strings.tagExplanation} />Tags</span>;

  // if the beneficiary has been set via URL, hide the beneficiary field
  const benField = (
    <FormField error={errors.beneficiaryID as string} touched={touched.beneficiaryID} inputID="as-ben" required={true} label={benLabel}>
      <BeneficiaryInput inputID="rsf-ben" onChange={onBenChange} onBlur={onBenBlur} onFocus={onBenFocus} allowUnknown={true} />
    </FormField>
  );

  return (
    <Form className="screen assessment-config" onSubmit={submitForm}>
      {!values.defaultBen && benField}
      <FormField error={errors.outcomeSetID as string} touched={touched.outcomeSetID} inputID="as-qid" required={true} label="Questionnaire">
        <QuestionSetSelect inputID="as-qid" onQuestionSetSelected={qsOnChange} onBlur={qsOnBlur} />
      </FormField>
      <FormField inputID="as-tags" label={tagLabel} touched={touched.tags as any} error={errors.tags as any}>
        <BeneficiaryTags beneficiaryID={values.debouncedBenID} />
        <TagInputWithBenSuggestions inputID="as-tags" onChange={setTags} tags={values.tags} id={values.debouncedBenID} allowNewTags={true} />
      </FormField>
      <div style={datePickerStyle}>
        <FormField inputID="as-datepicker" label="Date Conducted" touched={touched.date as boolean} error={errors.date as string}>
          <div id="as-datepicker">
            <span className="conductedDate">{moment(values.date).format('llll')}</span>
            <DateTimePicker moment={moment(values.date)} onChange={setConductedDate} allowFutureDates={true} />
          </div>
        </FormField>
      </div>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{props.buttonText}</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Starting the assessment failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

export const AssessmentConfig = withFormik<IProps, IAssessmentConfigAndDebounce>({
  validate: (values: IAssessmentConfigAndDebounce) => {
    const errors: FormikErrors<IAssessmentConfigAndDebounce> = {};
    if (!values.beneficiaryID || values.beneficiaryID === '') {
      errors.beneficiaryID = 'Please enter a beneficiary ID';
    }
    if (!values.outcomeSetID || values.outcomeSetID === '') {
      errors.outcomeSetID = 'Please select a questionnaire';
    }
    if (!values.date || values.date.getTime() > Date.now()) {
      errors.date = 'Please select a date in the past' as any;
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IAssessmentConfigAndDebounce>): void => {
    formikBag.setSubmitting(true);
    formikBag.props.onSubmit({
      outcomeSetID: v.outcomeSetID,
      beneficiaryID: v.beneficiaryID,
      tags: v.tags,
      date: v.date,
    })
      .then(() => {
        // will move on from this component so no need to do anything
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e);
      });
  },
  mapPropsToValues: (p: IProps): IAssessmentConfigAndDebounce => {
    return {
      beneficiaryID: p.defaultBen ? p.defaultBen : '',
      debouncedBenID: p.defaultBen,
      defaultBen: p.defaultBen,
      outcomeSetID: '',
      tags: [],
      date: new Date(),
    };
  },
})(InnerForm);
