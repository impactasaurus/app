import * as React from "react";
import { Radio, Form, Button } from "semantic-ui-react";
import { DateRangePicker } from "components/DateRangePicker";
import { Hint } from "components/Hint";
import { QuestionnaireSelect } from "components/QuestionnaireSelect/pref";
import { FormField } from "components/FormField";
import "./style.less";
import {
  FormikBag,
  FormikErrors,
  FormikValues,
  FormikProps,
  withFormik,
} from "formik";
import { TagInputWithQuestionnaireSuggestions } from "components/TagInput";
import { Trans } from "react-i18next";
import { IntroduceReportForm } from "components/TourReports";

export interface IFormOutput {
  questionSetID: string;
  all: boolean;
  start?: Date;
  end?: Date;
  tags: string[];
  orTags: boolean;
}

interface IProps {
  onFormSubmit(v: IFormOutput): void;
  t: (text: string) => string;
  initial?: IFormOutput;
}

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const {
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    submitForm,
    setFieldTouched,
    isValid,
    values,
    t,
  } = props;
  const qsOnBlur = () => setFieldTouched("questionSetID");
  const qsOnChange = (qsID: string) => {
    if (qsID !== values.questionSetID) {
      setFieldValue("questionSetID", qsID);
    }
  };
  const allOnChange = (toSet: boolean) => () => {
    setFieldValue("all", toSet);
    setFieldTouched("all");
  };
  const setDateRange = (start: Date | null, end: Date | null): void => {
    setFieldValue("start", start);
    setFieldValue("end", end);
    setFieldTouched("start");
    setFieldTouched("end");
  };
  const setTags = (tags: string[]) => {
    setFieldValue("tags", tags);
    setFieldTouched("tags");
  };
  const orTagsOnChange = (toSet: boolean) => () => {
    setFieldValue("orTags", toSet);
    setFieldTouched("orTags");
  };

  const dateRangeStyle: React.CSSProperties = {};
  if (values.all) {
    dateRangeStyle.display = "none";
  }

  const tagLabel = (
    <span>
      <Hint
        text={t(
          "Use tags to filter the records you would like included within the report. Common uses of tag filtering include generating reports for a particular intervention or location."
        )}
      />
      {t("Tags")}
    </span>
  );
  const incRecordLabel = (
    <span>
      <Hint
        text={t(
          "Only records within the specified time range will be included in the report"
        )}
      />
      {t("Included Records")}
    </span>
  );

  const questionnaireInputID = "report-questionnaire-input";
  const dateSelectID = "report-date-input";
  const tagSelectID = "report-tag-input";
  const submitButtonID = "report-submit-button";

  return (
    <Form className="screen" onSubmit={submitForm} id="report-form-component">
      <FormField
        error={errors.questionSetID}
        touched={touched.questionSetID}
        inputID="rf-qid"
        required={true}
        label={t("Questionnaire")}
        id={questionnaireInputID}
      >
        <QuestionnaireSelect
          inputID="rf-qid"
          onQuestionnaireSelected={qsOnChange}
          onBlur={qsOnBlur}
          autoSelectFirst={true}
        />
      </FormField>
      <FormField
        label={incRecordLabel}
        required={true}
        inputID="filter-options"
        error={errors.all}
        touched={touched.all}
        id={dateSelectID}
      >
        <div id="filter-options">
          <Radio
            checked={values.all === true}
            onChange={allOnChange(true)}
            label={t("All")}
          />
          <Radio
            checked={values.all === false}
            onChange={allOnChange(false)}
            label={t("Date Range")}
          />
        </div>
      </FormField>
      <div style={dateRangeStyle}>
        <FormField
          label={t("Date Range")}
          required={true}
          inputID="rf-date-picker"
          error={(errors.start as string) || (errors.end as string)}
          touched={(touched.end as boolean) || (touched.start as boolean)}
        >
          <div id="rf-date-picker">
            <DateRangePicker onSelectUnfiltered={setDateRange} future={false} />
          </div>
        </FormField>
      </div>
      <FormField
        inputID="rf-tags"
        label={tagLabel}
        touched={touched.tags}
        error={errors.tags as string}
        id={tagSelectID}
      >
        <TagInputWithQuestionnaireSuggestions
          inputID="rf-tags"
          id={values.questionSetID}
          onChange={setTags}
          tags={values.tags}
          allowNewTags={false}
        >
          {values.tags.length >= 2 && (
            <div style={{ marginTop: "1em" }}>
              <Trans
                defaults="Records must have <bg><bAll>all</bAll><or /><bAny>any</bAny></bg> of the tags to be included in the report"
                components={{
                  bg: (
                    <Button.Group size="mini" style={{ margin: "0 0.3rem" }} />
                  ),
                  bAll: (
                    <Button
                      type="button"
                      active={!values.orTags}
                      onClick={orTagsOnChange(false)}
                    />
                  ),
                  bAny: (
                    <Button
                      type="button"
                      active={values.orTags}
                      onClick={orTagsOnChange(true)}
                    />
                  ),
                  or: <Button.Or text={t("or")} />,
                }}
              />
            </div>
          )}
        </TagInputWithQuestionnaireSuggestions>
      </FormField>

      <Form.Group>
        <Form.Button
          type="submit"
          primary={true}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          id={submitButtonID}
        >
          {t("Generate")}
        </Form.Button>
      </Form.Group>
      <IntroduceReportForm
        questionnaireID={questionnaireInputID}
        questionnaireCompleted={!errors.questionSetID}
        dateRangeID={dateSelectID}
        dateRangeCompleted={values.all}
        tagsID={tagSelectID}
        tagsComplete={!errors.tags && values.tags.length === 0}
        submitID={submitButtonID}
      />
    </Form>
  );
};

export const ReportForm = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput, props: IProps) => {
    const t = props.t;
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.questionSetID || values.questionSetID === "") {
      errors.questionSetID = t("Please select a questionnaire");
    }
    const noTimeRange = !values.start || !values.end;
    if (!values.all && noTimeRange) {
      errors.start = t("Please select a time range");
    }
    if (!values.all && values.start >= values.end) {
      errors.start = t("Please select a valid time range");
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, IFormOutput>
  ): void => {
    formikBag.setSubmitting(true);
    formikBag.props.onFormSubmit(v as IFormOutput);
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    if (p.initial) {
      return p.initial;
    }
    return {
      questionSetID: "",
      all: true,
      tags: [],
      orTags: false,
    };
  },
  validateOnMount: true,
})(InnerForm);
