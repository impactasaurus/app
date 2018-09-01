import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {FormField} from 'components/FormField';
import { Icon, Input, Form, TextArea } from 'semantic-ui-react';
import {Hint} from 'components/Hint';
import {FormikBag, FormikErrors, FormikValues, InjectedFormikProps, withFormik} from 'formik';
const strings = require('./../../../strings.json');

interface IProps extends IOutcomeMutation {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

interface IFormOutput {
  name: string;
  description?: string;
  instructions?: string;
}

const InnerForm = (props: InjectedFormikProps<any, IFormOutput>) => {
  const { touched, error, errors, isSubmitting, values, submitForm, isValid, handleChange, handleBlur, handleReset } = props;
  const standardProps = {
    onChange: handleChange,
    onBlur: handleBlur,
  };
  const instructionLabel = <span><Hint text={strings.instructionsExplanation} />Instructions</span>;
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField error={errors.name as string} touched={touched.name} inputID="qg-name" required={true} label="Name">
        <Input id="qg-name" name="name" type="text" placeholder="Name" value={values.name} {...standardProps}/>
      </FormField>
      <FormField error={errors.description as string} touched={touched.description} inputID="qg-description" label="Description">
        <Input id="qg-description" name="description" type="text" placeholder="Description" value={values.description} {...standardProps}/>
      </FormField>
      <FormField error={errors.instructions as string} touched={touched.instructions} inputID="qg-instructions" label={instructionLabel}>
        <TextArea id="qg-instructions" name="instructions" type="text" placeholder="Instructions" value={values.instructions} autoHeight={true} {...standardProps}/>
      </FormField>
      <Form.Group>
        <Form.Button onClick={handleReset}>Cancel</Form.Button>
        <Form.Button type="submit" primary={true} disabled={!isValid || isSubmitting} loading={isSubmitting}>Save</Form.Button>
      </Form.Group>
      {error && <span className="submit-error"><Icon name="exclamation" />Editing the questionnaire failed. {strings.formFailureGeneric}</span>}
    </Form>
  );
};

const GeneralInner = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.name || values.name === '') {
      errors.name = 'Please give the questionnaire a name';
    }
    return errors;
  },
  handleSubmit: (v: FormikValues, formikBag: FormikBag<IProps, IFormOutput>): void => {
    formikBag.setSubmitting(true);
    formikBag.props.editQuestionSet(formikBag.props.match.params.id, v.name, v.description, v.instructions)
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.setError(undefined);
        formikBag.resetForm();
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setError(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    if (p.data.loading || p.data.getOutcomeSet === undefined) {
      return {
        name: '',
      };
    }
    const os = p.data.getOutcomeSet;
    return {
      name: os.name,
      description: os.description,
      instructions: os.instructions,
    };
  },
})(InnerForm);

export const General = editQuestionSet<IProps>(getOutcomeSet<IProps>((props) => props.match.params.id)(GeneralInner));
