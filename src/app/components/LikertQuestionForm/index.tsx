import * as React from 'react';
import { Icon, Form, Input, Select, DropdownItemProps } from 'semantic-ui-react';
import {IOutcomeSet} from 'models/outcomeSet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ILabel, ILikertQuestionForm, ILikertForm} from 'models/question';
import {LikertFormField} from 'components/LikertFormField';
import {FormField} from 'components/FormField';
import {Hint} from 'components/Hint';
import {FormikBag, FormikErrors, FormikProps, FormikValues, withFormik} from 'formik';
import ReactGA from 'react-ga';
import { WithTranslation, withTranslation } from 'react-i18next';
import './style.less';

interface IProps extends WithTranslation {
  data?: IOutcomeResult;

  QuestionSetID: string;
  OnSuccess: ()=>void;
  onCancel: ()=>void;
  onSubmitButtonClick: (question: ILikertQuestionForm)=>Promise<IOutcomeSet>;
  edit?: boolean;
  values: ILikertQuestionForm;
  submitButtonText: string;
}

const InnerForm = (props: IProps & FormikProps<ILikertQuestionForm>) => {
  const { touched, values, status, errors, isSubmitting, handleChange, onCancel, edit, dirty, t,
          submitForm, handleBlur, isValid, submitButtonText, setFieldValue, setFieldTouched} = props;
  const categoryOptions = (values as any).categoryOptions;

  const standardActions = {
    onChange: handleChange,
    onBlur: handleBlur,
  };

  const setLikertOptions = (options: ILikertForm) => {
    setFieldValue('leftValue', options.leftValue);
    setFieldTouched('leftValue');
    setFieldValue('rightValue', options.rightValue);
    setFieldTouched('rightValue');
    setFieldValue('labels', options.labels);
    setFieldTouched('labels');
  };

  // standardActions don't work as it is not a normal input component
  // and formik doesn't get a name attribute to work with
  const onCategoryChanged = (_, v) => {
    setFieldValue('categoryID', v.value);
  };

  const onCategoryBlur = () => {
    setFieldTouched('categoryID');
  };

  const shortenedLabel: JSX.Element = (
    <span>
      {t("Shortened Form")}
      <Hint text={t("Shortened form of the question. Used instead of the question, when reviewing data in visualisations and exports")}/>
    </span>
  );

  return (
    <Form onSubmit={submitForm}>
      <Form.Group>
        <FormField error={errors.question as string} touched={touched.question} inputID="lqf-question" label={t("Question")} required={true} width={12}>
          <Input id="lqf-question" name="question" type="text" placeholder={t("Question")} autoFocus={true} value={values.question} {...standardActions} />
        </FormField>
        <FormField error={errors.short as string} touched={touched.short} inputID="lqf-short" label={shortenedLabel} width={4}>
          <Input id="lqf-short" name="short" type="text" placeholder={t("Shortened Form")} value={values.short} {...standardActions} />
        </FormField>
      </Form.Group>
      <Form.Group>
        <FormField error={errors.description as string} touched={touched.description} inputID="lqf-desc" label={t("Description")} width={12}>
          <Input id="lqf-desc" name="description" type="text" placeholder={t("Description")} value={values.description} {...standardActions} />
        </FormField>
        <FormField error={errors.categoryID as string} touched={touched.categoryID} inputID="lqf-cat" label={t("Category")} width={4}>
          <Select id="lqf-cat" options={categoryOptions} placeholder={t("Category")} value={values.categoryID} onChange={onCategoryChanged} onBlur={onCategoryBlur} />
        </FormField>
      </Form.Group>
      <LikertFormField
        edit={edit}
        values={{
          labels: values.labels,
          leftValue: values.leftValue,
          rightValue: values.rightValue,
        }}
        errors={{
          labels: errors.labels as string,
          leftValue: errors.leftValue as string,
          rightValue: errors.rightValue as string,
        }}
        touched={{
          labels: !!touched.labels,
          leftValue: touched.leftValue as boolean,
          rightValue: touched.rightValue as boolean,
        }}
        onChange={setLikertOptions}
      />
      <Form.Group>
        <Form.Button onClick={onCancel}>{t("Cancel")}</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting}>{submitButtonText}</Form.Button>
      </Form.Group>
      {status &&
        <span className="submit-error"><Icon name="exclamation" />
          {t("Saving the question failed.")} {t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}
        </span>}
    </Form>
  );
};

const LikertQuestionFormInner = withFormik<IProps, ILikertQuestionForm>({
  validate: (values: ILikertQuestionForm, p: IProps) => {
    const {t} = p;
    const errors: FormikErrors<ILikertQuestionForm> = {};
    if (!values.question || typeof values.question !== 'string' || values.question.length === 0) {
      errors.question = t('Please enter a question');
    }
    if (values.leftValue === undefined || typeof values.leftValue !== 'number') {
      errors.leftValue = t('Please enter a value for the left extreme of the scale');
    }
    if (values.rightValue === undefined || typeof values.rightValue !== 'number') {
      errors.leftValue = t('Please enter a value for the right extreme of the scale');
    }
    if (values.leftValue === values.rightValue) {
      errors.leftValue = t('The left and right values cannot be equal');
    }
    const findLabelForValue = (val: number): ILabel|undefined => values.labels.find((l) => l.value === val);
    if (findLabelForValue(values.leftValue) === undefined || findLabelForValue(values.rightValue) === undefined) {
      errors.labels = t('Please set labels for at least the left and right extremes of the scale');
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

  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, ILikertQuestionForm>): void => {
    formikBag.setSubmitting(true);
    formikBag.setStatus(undefined);
    formikBag.props.onSubmitButtonClick(v as ILikertQuestionForm)
      .then(() => {
        logQuestionGAEvent(formikBag.props.edit ? 'edited' : 'created');
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

const LikertQuestionFormData = getOutcomeSet<IProps>((props) => props.QuestionSetID)(LikertQuestionFormInner);
const LikertQuestionFormTranslated = withTranslation()(LikertQuestionFormData);
export const LikertQuestionForm = LikertQuestionFormTranslated;

function logQuestionGAEvent(action) {
  ReactGA.event({
    category: 'question',
    action,
    label: 'likert',
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
    text: p.t('No Category'),
  });
  return categories;
}
