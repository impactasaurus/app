import React from "react";
import { Form, Input, Icon, DropdownItemProps } from "semantic-ui-react";
import {
  getSelf,
  IGetSelf,
  IUpdateSelf,
  updateSelf,
} from "apollo/modules/user";
import { FormField } from "components/FormField";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import {
  FormikBag,
  FormikErrors,
  FormikValues,
  FormikProps,
  withFormik,
} from "formik";
import { withTranslation, WithTranslation } from "react-i18next";
import supportedLanguages from "./../../../i18n/languages.json";
import { getLangNameFromCode } from "language-name-map";
import "./style.less";

interface IProps extends IUpdateSelf, Partial<WithTranslation> {
  self?: IGetSelf;
  additionalFields?: JSX.Element[];
}

interface IFormOutput {
  name: string;
  subscribed: boolean;
  notifyOnRemote: boolean;
  language: string;
}

const getLanguageOptions = (
  t: (s: string) => string,
  current?: string
): DropdownItemProps[] => {
  const languages = supportedLanguages.map((l: string) => ({
    key: l,
    text: getLangNameFromCode(l).native,
    value: l,
  }));
  if (supportedLanguages.indexOf(current) === -1 && current) {
    const lookup = getLangNameFromCode(current);
    if (lookup) {
      // supportedLanguages is composed of languages with > 80% coverage.
      // it could be that a language previously had > 80% but now doesn't,
      // we want to continue to offer that language to existing users of it
      languages.unshift({ key: current, text: lookup.native, value: current });
    }
  }
  languages.sort();
  languages.unshift({ key: "und", text: t("Auto Detect"), value: "und" });
  return languages;
};

const InnerForm = (props: IProps & FormikProps<IFormOutput>) => {
  const {
    touched,
    status,
    errors,
    isSubmitting,
    submitForm,
    isValid,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    dirty,
    handleReset,
    t,
  } = props;
  const marketingLabel = (
    <label>{t("Email me occasional updates from Impactasaurus")}</label>
  );
  const notifyOnRemoteLabel = (
    <label>{t("Email me when beneficiaries complete my remote links")}</label>
  );
  const languages = getLanguageOptions(t, values.language);
  const languageSelected = (_, e) => {
    setFieldValue("language", e.value);
  };
  return (
    <Form className="screen" onSubmit={submitForm}>
      <FormField
        error={errors.name as string}
        touched={touched.name}
        inputID="usf-name"
        label={t("Name")}
        required={true}
      >
        <Input
          id="usf-name"
          name="name"
          type="text"
          placeholder={t("Your Name")}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
        />
      </FormField>
      <FormField
        error={errors.subscribed as string}
        touched={touched.subscribed}
        inputID="usf-subscribe"
        label={t("Notifications")}
      >
        <Form.Checkbox
          id="usf-subscribe"
          name="subscribed"
          label={marketingLabel}
          onChange={handleChange}
          checked={values.subscribed}
        />
        <Form.Checkbox
          id="usf-notifyOnRemote"
          name="notifyOnRemote"
          label={notifyOnRemoteLabel}
          onChange={handleChange}
          checked={values.notifyOnRemote}
        />
      </FormField>
      <FormField
        error={errors.language}
        touched={touched.language}
        inputID="usf-lang"
        label={t("Language")}
      >
        <Form.Dropdown
          id="usf-language"
          name="language"
          onChange={languageSelected}
          selection={true}
          value={values.language}
          options={languages}
        />
      </FormField>
      {props.additionalFields}
      <Form.Group>
        <Form.Button type="reset" disabled={!dirty} onClick={handleReset}>
          {t("Cancel")}
        </Form.Button>
        <Form.Button
          type="submit"
          primary={true}
          disabled={!dirty || !isValid || isSubmitting}
          loading={isSubmitting}
        >
          {t("Save")}
        </Form.Button>
      </Form.Group>
      {status && (
        <span className="submit-error">
          <Icon name="exclamation" />
          {t("Editing your user account failed.")}{" "}
          {t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </span>
      )}
    </Form>
  );
};

export const UserSettingsInner = withFormik<IProps, IFormOutput>({
  validate: (values: IFormOutput, p: IProps) => {
    const errors: FormikErrors<IFormOutput> = {};
    if (!values.name || values.name.length === 0) {
      errors.name = p.t("Please provide your name");
    }
    return errors;
  },
  handleSubmit: (
    v: FormikValues,
    formikBag: FormikBag<IProps, IFormOutput>
  ): void => {
    formikBag.setStatus(undefined);
    formikBag.setSubmitting(true);
    const vals = v as IFormOutput;
    formikBag.props
      .updateSelf(
        vals.name,
        !vals.subscribed,
        vals.notifyOnRemote,
        vals.language
      )
      .then(() => {
        formikBag.setSubmitting(false);
        formikBag.resetForm({ values: vals });
      })
      .catch((e) => {
        formikBag.setSubmitting(false);
        formikBag.setStatus(e);
      });
  },
  mapPropsToValues: (p: IProps): IFormOutput => {
    return {
      name: p.self.getSelf.profile.name,
      subscribed: !p.self.getSelf.settings.unsubscribed,
      notifyOnRemote: p.self.getSelf.settings.notifyOnRemote,
      language: p.self.getSelf.settings.language || "und",
    };
  },
  validateOnMount: true,
})(InnerForm);

// t("user")
const UserSettingsWithLoader = ApolloLoaderHoC(
  "user",
  (p: IProps) => p.self,
  UserSettingsInner
);
const UserSettingsWithTrans = withTranslation()(UserSettingsWithLoader);
const UserSettings = updateSelf<IProps>(getSelf(UserSettingsWithTrans, "self"));
export { UserSettings };
