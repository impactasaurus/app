import * as React from 'react';
import { Icon, Form, Input, Select, DropdownItemProps } from 'semantic-ui-react';
import {IOutcomeSet} from 'models/outcomeSet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ILabel, ILikertQuestionForm, ILikertForm} from 'models/question';
import {LikertFormField} from 'components/LikertFormField';
import {FormField} from 'components/FormField';
import {Hint} from 'components/Hint';
import './style.less';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
const ReactGA = require('react-ga');
const formFailureGeneric = require('../../../strings.json').formFailureGeneric;

interface IInnerFormProps {
  onCancel: ()=>void;
  submitButtonText: string;
  edit?: boolean;
}

interface IExternalProps {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  onCancel: ()=>void;
  onSubmitButtonClick: (question: ILikertQuestionForm)=>Promise<IOutcomeSet>;
  edit?: boolean;
  values: ILikertQuestionForm;
  submitButtonText: string;
}

interface IProps extends IExternalProps {
  data?: IOutcomeResult;
}

const shortenedLabel: JSX.Element = (
  <span>
    Shortened Form
    <Hint text="Shortened form of the question. Used instead of the question, when reviewing data in visualisations and exports"/>
  </span>
);

const InnerForm = (props: InjectedFormikProps<IInnerFormProps, ILikertQuestionForm>) => {
  const { touched, values, error, errors, isSubmitting, handleChange, onCancel, edit,
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

  return (
    <Form onSubmit={submitForm}>
      <Form.Group>
        <FormField error={errors.question as string} touched={touched.question} inputID="lqf-question" label="Question" required={true} width={12}>
          <Input id="lqf-question" name="question" type="text" placeholder="Question" value={values.question} {...standardActions} />
        </FormField>
        <FormField error={errors.short as string} touched={touched.short} inputID="lqf-short" label={shortenedLabel} width={4}>
          <Input id="lqf-short" name="short" type="text" placeholder="Shortened Form" value={values.short} {...standardActions} />
        </FormField>
      </Form.Group>
      <Form.Group>
        <FormField error={errors.description as string} touched={touched.description} inputID="lqf-desc" label="Description" width={12}>
          <Input id="lqf-desc" name="description" type="text" placeholder="Description" value={values.description} {...standardActions} />
        </FormField>
        <FormField error={errors.categoryID as string} touched={touched.categoryID} inputID="lqf-cat" label="Category" width={4}>
          <Select id="lqf-cat" name="categoryID" options={categoryOptions} placeholder="Category" value={values.categoryID} {...standardActions} />
        </FormField>
      </Form.Group>
      <LikertFormField
        edit={edit}
        labels={values.labels}
        leftValue={values.leftValue}
        rightValue={values.rightValue}
        onChange={setLikertOptions}
      />
      {errors.leftValue && <div className="error validation"><Icon name="exclamation" />{errors.leftValue}</div>}
      {errors.rightValue && <div className="error validation"><Icon name="exclamation" />{errors.rightValue}</div>}
      {errors.labels && <div className="error validation"><Icon name="exclamation" />{errors.labels}</div>}
      <Form.Group>
        <Form.Button onClick={onCancel}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>{submitButtonText}</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Saving the question failed. {formFailureGeneric}</span>}
    </Form>
  );
};

const LikertQuestionFormInner = withFormik<IProps, ILikertQuestionForm>({
  validate: (values: ILikertQuestionForm) => {
    const errors: FormikErrors<ILikertQuestionForm> = {};
    if (!values.question || typeof values.question !== 'string' || values.question.length === 0) {
      errors.question = 'Please enter a question';
    }
    if (values.leftValue === undefined || typeof values.leftValue !== 'number') {
      errors.leftValue = 'Please enter a value for the left extreme of the scale' as any;
    }
    if (values.rightValue === undefined || typeof values.rightValue !== 'number') {
      errors.leftValue = 'Please enter a value for the right extreme of the scale' as any;
    }
    if (values.leftValue === values.rightValue) {
      errors.leftValue = 'The left and right values cannot be equal' as any;
    }
    const findLabelForValue = (val: number): ILabel|undefined => values.labels.find((l) => l.value === val);
    if (findLabelForValue(values.leftValue) === undefined || findLabelForValue(values.rightValue) === undefined) {
      errors.labels = 'Please set labels for the left and right extremes of the scale' as any;
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
    formikBag.setError(undefined);
    formikBag.props.onSubmitButtonClick(v as ILikertQuestionForm)
      .then(() => {
        logQuestionGAEvent(formikBag.props.edit ? 'edited' : 'created');
        formikBag.setSubmitting(false);
        formikBag.props.OnSuccess();
      })
      .catch((e: Error) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e.message);
      });
  },
})(InnerForm);

export const LikertQuestionForm = getOutcomeSet<IProps>((props) => props.QuestionSetID)(LikertQuestionFormInner);

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
    text: 'No Category',
  });
  return categories;
}
