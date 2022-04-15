import * as React from "react";
import { Icon, Form } from "semantic-ui-react";
import { DateTimePicker } from "components/DateTimePicker";
import { Hint } from "components/Hint";
import { TagInputWithBenSuggestions } from "components/TagInput";
import { BeneficiaryInput } from "components/BeneficiaryInput";
import { FormField } from "components/FormField";
import { IAssessmentConfig } from "models/assessment";
import { QuestionSetSelect } from "components/QuestionSetSelect";
import { BeneficiaryTags } from "components/BeneficiaryTags";
import moment from "moment";
import {
  FormikBag,
  FormikErrors,
  FormikValues,
  FormikProps,
  withFormik,
} from "formik";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  IntroduceDataEntryForm,
  IntroduceNewRecordForm,
} from "components/TourRecordCreation";
import "./style.less";

interface IProps extends WithTranslation {
  showDatePicker: boolean;
  buttonText: string;
  onSubmit: (config: IAssessmentConfig) => Promise<void>;
  defaultBen?: string;
}

interface IAssessmentConfigAndDebounce extends IAssessmentConfig {
  debouncedBenID?: string;
  defaultBen?: string;
}

const InnerForm = (
  props: IProps & FormikProps<IAssessmentConfigAndDebounce>
) => {
  const {
    touched,
    status,
    errors,
    isSubmitting,
    setFieldValue,
    submitForm,
    setFieldTouched,
    isValid,
    values,
    t,
  } = props;

  const qsOnBlur = () => setFieldTouched("outcomeSetID");
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.outcomeSetID) {
      setFieldValue("outcomeSetID", qsID);
    }
  };
  const setConductedDate = (date: moment.Moment) => {
    setFieldValue("date", date.toDate());
    setFieldTouched("date");
  };
  const setTags = (tags: string[]) => {
    setFieldValue("tags", tags);
    setFieldTouched("tags");
  };

  const datePickerStyle = {} as React.CSSProperties;
  if (!props.showDatePicker) {
    datePickerStyle.display = "none";
  }

  const onBenChange = (benID: string) => setFieldValue("beneficiaryID", benID);
  const onBenBlur = (benID: string) => {
    setFieldTouched("beneficiaryID");
    setFieldTouched("debouncedBenID");
    setFieldValue("debouncedBenID", benID);
  };
  const onBenFocus = () => {
    setFieldValue("debouncedBenID", undefined);
  };

  const benLabel = (
    <span>
      <Hint
        text={t(
          "Beneficiary identifiers should not contain personal information. Ideally this would be the ID of the beneficiary within your other systems (e.g. CRM)"
        )}
      />
      {t("New or Existing Beneficiary")}
    </span>
  );
  const tagLabel = (
    <span>
      <Hint
        text={t(
          "Tags are words which can be saved against records. They can be used to filter your records when reporting. Common uses of tags include demographic or intervention information."
        )}
      />
      {t("Tags")}
    </span>
  );

  const benInputID = "new-record-ben-input";
  const questionnaireInputID = "new-record-questionnaire-input";
  const tagInputID = "new-record-tag-input";
  const submitButtonID = "new-record-submit";
  const dateSelectID = "new-record-date-select";

  // if the beneficiary has been set via URL, hide the beneficiary field
  const benField = (
    <FormField
      error={errors.beneficiaryID as string}
      touched={touched.beneficiaryID}
      inputID="as-ben"
      required={true}
      label={benLabel}
      id={benInputID}
    >
      <BeneficiaryInput
        inputID="rsf-ben"
        onChange={onBenChange}
        onBlur={onBenBlur}
        onFocus={onBenFocus}
      />
    </FormField>
  );

  return (
    <>
      <Form className="screen assessment-config" onSubmit={submitForm}>
        {!values.defaultBen && benField}
        <FormField
          error={errors.outcomeSetID as string}
          touched={touched.outcomeSetID}
          inputID="as-qid"
          required={true}
          label={t("Questionnaire")}
          id={questionnaireInputID}
        >
          <QuestionSetSelect
            inputID="as-qid"
            onQuestionSetSelected={qsOnChange}
            onBlur={qsOnBlur}
            autoSelectFirst={true}
          />
        </FormField>
        <FormField
          inputID="as-tags"
          label={tagLabel}
          touched={touched.tags}
          error={errors.tags as string}
          id={tagInputID}
        >
          <BeneficiaryTags beneficiaryID={values.debouncedBenID} />
          <TagInputWithBenSuggestions
            inputID="as-tags"
            onChange={setTags}
            tags={values.tags}
            id={values.debouncedBenID}
            allowNewTags={true}
          />
        </FormField>
        <div style={datePickerStyle}>
          <FormField
            inputID="as-datepicker"
            label={t("Date Conducted")}
            touched={touched.date as boolean}
            error={errors.date as string}
            id={dateSelectID}
          >
            <div id="as-datepicker">
              <span className="conductedDate">
                {moment(values.date).format("llll")}
              </span>
              <DateTimePicker
                moment={moment(values.date)}
                onChange={setConductedDate}
                allowFutureDates={true}
              />
            </div>
          </FormField>
        </div>
        <Form.Group>
          <Form.Button
            type="submit"
            primary={true}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            id={submitButtonID}
          >
            {props.buttonText}
          </Form.Button>
        </Form.Group>
        {status && (
          <span className="submit-error">
            <Icon name="exclamation" />
            {t("Starting the assessment failed.")}{" "}
            {t(
              "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
            )}
          </span>
        )}
      </Form>
      <IntroduceNewRecordForm
        benInputID={benInputID}
        questionnaireInputID={questionnaireInputID}
        submitButtonID={submitButtonID}
        isBenComplete={!errors.beneficiaryID}
        isQuestionnaireSelected={!errors.outcomeSetID}
      />
      <IntroduceDataEntryForm
        dateSelectID={dateSelectID}
        isDateSelectionComplete={
          !errors.date &&
          values.date &&
          Date.now() - values.date.getTime() > 8.64e7
        }
        submitButtonID={submitButtonID}
      />
    </>
  );
};

const AssessmentConfigInner = withFormik<IProps, IAssessmentConfigAndDebounce>({
  validate: (values: IAssessmentConfigAndDebounce, p: IProps) => {
    const { t } = p;
    const errors: FormikErrors<IAssessmentConfigAndDebounce> = {};
    if (!values.beneficiaryID || values.beneficiaryID === "") {
      errors.beneficiaryID = t("Please enter a beneficiary ID");
    }
    if (!values.outcomeSetID || values.outcomeSetID === "") {
      errors.outcomeSetID = t("Please select a questionnaire");
    }
    if (!values.date || values.date.getTime() > Date.now()) {
      errors.date = t("Please select a date in the past");
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, IAssessmentConfigAndDebounce>
  ): void => {
    formikBag.setStatus(null);
    formikBag.setSubmitting(true);
    formikBag.props
      .onSubmit({
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
        formikBag.setStatus(e);
      });
  },
  mapPropsToValues: (p: IProps): IAssessmentConfigAndDebounce => {
    return {
      beneficiaryID: p.defaultBen ? p.defaultBen : "",
      debouncedBenID: p.defaultBen,
      defaultBen: p.defaultBen,
      outcomeSetID: "",
      tags: [],
      date: new Date(),
    };
  },
  validateOnMount: true,
})(InnerForm);

export const AssessmentConfig = withTranslation()(AssessmentConfigInner);
