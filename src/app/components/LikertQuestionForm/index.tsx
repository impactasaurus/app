import React from "react";
import {
  Icon,
  Form,
  Input,
  Select,
  DropdownItemProps,
} from "semantic-ui-react";
import { IOutcomeSet } from "models/outcomeSet";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { ILabel, ILikertQuestionForm, ILikertForm } from "models/question";
import { LikertFormField } from "components/LikertFormField";
import { FormField } from "components/FormField";
import { Hint } from "components/Hint";
import {
  FormikBag,
  FormikErrors,
  FormikProps,
  FormikValues,
  withFormik,
} from "formik";
import ReactGA from "react-ga";
import { WithTranslation, withTranslation } from "react-i18next";
import { FormSection } from "components/FormSection";
import "./style.less";

interface IProps extends WithTranslation {
  data?: IOutcomeResult;

  QuestionSetID: string;
  OnSuccess: () => void;
  onCancel: () => void;
  onSubmitButtonClick: (question: ILikertQuestionForm) => Promise<IOutcomeSet>;
  values: ILikertQuestionForm;
  submitButtonText: string;

  editing?: boolean;
  inUse?: boolean;
}

const QuestionLengthRequiresShort = 30;

const LabelAndHint = ({ label, hint }: { label: string; hint: string }) => (
  <span>
    <Hint text={hint} />
    {label}
  </span>
);

const InnerForm = (p: IProps & FormikProps<ILikertQuestionForm>) => {
  const categoryOptions = (p.values as any).categoryOptions;

  const standardActions = {
    onChange: p.handleChange,
    onBlur: p.handleBlur,
  };

  const setLikertOptions = (options: ILikertForm) => {
    p.setFieldValue("leftValue", options.leftValue);
    p.setFieldTouched("leftValue");
    p.setFieldValue("rightValue", options.rightValue);
    p.setFieldTouched("rightValue");
    p.setFieldValue("labels", options.labels);
    p.setFieldTouched("labels");
  };

  // standardActions don't work as it is not a normal input component
  // and formik doesn't get a name attribute to work with
  const onCategoryChanged = (_, v) => {
    p.setFieldValue("categoryID", v.value);
  };

  const onCategoryBlur = () => {
    p.setFieldTouched("categoryID");
  };

  return (
    <Form onSubmit={p.submitForm}>
      <FormField
        error={p.errors.question as string}
        touched={p.touched.question}
        inputID="lqf-question"
        label={p.t("Question")}
        required={true}
      >
        <Input
          id="lqf-question"
          name="question"
          type="text"
          placeholder={p.t("Question")}
          autoFocus={true}
          value={p.values.question}
          {...standardActions}
        />
      </FormField>
      <FormField
        error={p.errors.description as string}
        touched={p.touched.description}
        inputID="lqf-desc"
        label={
          <LabelAndHint
            hint={p.t(
              "Shown under the question, used to provide additional clarification or context"
            )}
            label={p.t("Description")}
          />
        }
      >
        <Input
          id="lqf-desc"
          name="description"
          type="text"
          placeholder={p.t("Description")}
          value={p.values.description}
          {...standardActions}
        />
      </FormField>
      <FormSection
        section={p.t("Scale")}
        collapsible={false}
        explanation={p.t("Define the scale used to answer the question")}
      >
        <LikertFormField
          canEdit={!p.inUse}
          values={{
            labels: p.values.labels,
            leftValue: p.values.leftValue,
            rightValue: p.values.rightValue,
          }}
          errors={{
            labels: p.errors.labels as string,
            leftValue: p.errors.leftValue as string,
            rightValue: p.errors.rightValue as string,
          }}
          touched={{
            labels: !!p.touched.labels,
            leftValue: p.touched.leftValue as boolean,
            rightValue: p.touched.rightValue as boolean,
          }}
          onChange={setLikertOptions}
        />
      </FormSection>

      <FormSection
        section={p.t("Comments")}
        collapsible={true}
        explanation={p.t(
          "A text box can be provided to gather comments from the beneficiary or facilitator"
        )}
      >
        <Form.Checkbox
          id="note-active"
          name="noteDeactivated"
          label={p.t("Include comment box")}
          checked={!p.values.noteDeactivated}
          onChange={() =>
            p.setFieldValue("noteDeactivated", !p.values.noteDeactivated)
          }
        />
        {!p.values.noteDeactivated && (
          <>
            <Form.Checkbox
              id="note-required"
              name="noteRequired"
              label={p.t("Require a comment to be entered")}
              checked={p.values.noteRequired}
              {...standardActions}
            />
            <FormField
              error={p.errors.notePrompt as string}
              touched={p.touched.notePrompt}
              inputID="lqf-noteprompt"
              label={
                <LabelAndHint
                  hint={p.t("Explains what should be written in the text box")}
                  label={p.t("Comment prompt")}
                />
              }
            >
              <Input
                id="lqf-noteprompt"
                name="notePrompt"
                type="text"
                placeholder={p.t("Defaults to 'Additional information'")}
                value={p.values.notePrompt}
                {...standardActions}
              />
            </FormField>
          </>
        )}
      </FormSection>

      <FormSection
        section={p.t("Results")}
        collapsible={p.values.question.length <= QuestionLengthRequiresShort}
        explanation={p.t(
          "The following options adjust the visualisation of the results and aren't shown to beneficiaries"
        )}
      >
        <Form.Group widths="equal">
          <FormField
            error={p.errors.categoryID as string}
            touched={p.touched.categoryID}
            inputID="lqf-cat"
            label={
              <LabelAndHint
                hint={p.t(
                  "Group related questions into categories. This allows aggregation of multiple questions into a single value."
                )}
                label={p.t("Category")}
              />
            }
          >
            <Select
              id="lqf-cat"
              options={categoryOptions}
              placeholder={p.t("Category")}
              value={p.values.categoryID}
              onChange={onCategoryChanged}
              onBlur={onCategoryBlur}
            />
          </FormField>
          <FormField
            error={p.errors.short as string}
            // because it depends on the length of the question as to whether this is required
            // show it as red without it having to be touched.
            // only show the error once it has been touched so it isn't too shouty
            touched={true}
            hideErrorMessage={p.touched.short !== true}
            inputID="lqf-short"
            label={
              <LabelAndHint
                hint={p.t(
                  "Used in graphs and exports, instead of the question"
                )}
                label={p.t("Shortened Question")}
              />
            }
            required={p.values.question.length > QuestionLengthRequiresShort}
          >
            <Input
              id="lqf-short"
              name="short"
              type="text"
              placeholder={p.t("Shortened Question")}
              value={p.values.short}
              {...standardActions}
            />
          </FormField>
        </Form.Group>
      </FormSection>
      <Form.Group>
        <Form.Button type="reset" onClick={p.onCancel}>
          {p.t("Cancel")}
        </Form.Button>
        <Form.Button
          type="submit"
          primary={true}
          disabled={!p.dirty || !p.isValid || p.isSubmitting}
          loading={p.isSubmitting}
        >
          {p.submitButtonText}
        </Form.Button>
      </Form.Group>
      {p.status && (
        <span className="submit-error">
          <Icon name="exclamation" />
          {p.t("Saving the question failed.")}{" "}
          {p.t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </span>
      )}
    </Form>
  );
};

const LikertQuestionFormInner = withFormik<IProps, ILikertQuestionForm>({
  validate: (values: ILikertQuestionForm, p: IProps) => {
    const { t } = p;
    const errors: FormikErrors<ILikertQuestionForm> = {};
    if (
      !values.question ||
      typeof values.question !== "string" ||
      values.question.length === 0
    ) {
      errors.question = t("Please enter a question");
    }
    if (
      values.question.length > QuestionLengthRequiresShort &&
      (!values.short || values.short.length === 0)
    ) {
      errors.short = t(
        "Please provide a shorter version of your question for use in graphs"
      );
    }
    if (
      values.leftValue === undefined ||
      typeof values.leftValue !== "number"
    ) {
      errors.leftValue = t(
        "Please enter a value for the left extreme of the scale"
      );
    }
    if (
      values.rightValue === undefined ||
      typeof values.rightValue !== "number"
    ) {
      errors.leftValue = t(
        "Please enter a value for the right extreme of the scale"
      );
    }
    if (values.leftValue === values.rightValue) {
      errors.leftValue = t("The left and right values cannot be equal");
    }
    const findLabelForValue = (val: number): ILabel | undefined =>
      values.labels.find((l) => l.value === val);
    if (
      findLabelForValue(values.leftValue) === undefined ||
      findLabelForValue(values.rightValue) === undefined
    ) {
      errors.labels = t(
        "Please set labels for at least the left and right extremes of the scale"
      );
    }
    return errors;
  },

  mapPropsToValues: (p: IProps) => {
    return {
      ...p.values,
      // get category options to the inner form
      // passing in values object, would be nicer in the props
      categoryOptions: getCategoryOptions(p),
    };
  },

  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, ILikertQuestionForm>
  ): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props
      .onSubmitButtonClick(v as ILikertQuestionForm)
      .then(() => {
        logQuestionGAEvent(formikBag.props.editing ? "edited" : "created");
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

const LikertQuestionFormData = getOutcomeSet<IProps>(
  (props) => props.QuestionSetID
)(LikertQuestionFormInner);
const LikertQuestionFormTranslated = withTranslation()(LikertQuestionFormData);
export const LikertQuestionForm = LikertQuestionFormTranslated;

function logQuestionGAEvent(action) {
  ReactGA.event({
    category: "question",
    action,
    label: "likert",
  });
}

function getCategoryOptions(p: IProps): DropdownItemProps[] {
  const categories = p.data.getOutcomeSet.categories.map((os) => {
    return {
      key: os.id,
      value: os.id,
      text: os.name,
    };
  });
  categories.unshift({
    key: null,
    value: null,
    text:
      categories.length === 0
        ? p.t("No Categories defined")
        : p.t("No Category"),
  });
  return categories;
}
