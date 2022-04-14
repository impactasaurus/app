import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { BeneficiaryInput } from "components/BeneficiaryInput";
import { FormField } from "components/FormField";
import { useNavigator } from "redux/modules/url";
import { Hint } from "components/Hint";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";

const Inner = () => {
  const setURL = useNavigator();
  const { t } = useTranslation();
  const [ben, setBen] = useState<{ id: string; existing: boolean }>();
  const [touched, setTouched] = useState<boolean>(false);

  const review = (benID: string, existingBen: boolean) => {
    let url = `/beneficiary/${benID}`;
    if (!existingBen) {
      url = url + "/record";
    }
    setURL(url, new URLSearchParams({ ben: benID }));
  };

  const onChange = (
    ben: string,
    existing: boolean,
    selected: boolean
  ): void => {
    if (selected) {
      review(ben, existing);
      return;
    }
    if (ben.length === 0) {
      setBen(undefined);
    } else {
      setBen({ id: ben, existing });
    }
  };

  const onSubmit = () => {
    review(ben.id, ben.existing);
  };

  let submitText = t("Submit");
  if (ben?.existing !== undefined) {
    submitText = ben?.existing ? t("View") : t("Create");
  }

  const label = (
    <span>
      <Hint
        text={t(
          "Beneficiary identifiers should not contain personal information. Ideally this would be the ID of the beneficiary within your other systems (e.g. CRM)"
        )}
      />
      {t("New or Existing Beneficiary")}
    </span>
  );

  return (
    <Form className="screen" onSubmit={onSubmit}>
      <FormField
        error={!ben ? t("Please select a beneficiary") : undefined}
        touched={touched}
        inputID="rsf-ben"
        required={true}
        label={label}
      >
        <BeneficiaryInput
          inputID="rsf-ben"
          onChange={onChange}
          onBlur={() => setTouched(true)}
          allowUnknown={true}
        />
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true} disabled={!ben}>
          {submitText}
        </Form.Button>
      </Form.Group>
    </Form>
  );
};

// t('Beneficiary')
export const BeneficiarySelector = PageWrapperHoC(
  "Beneficiary",
  "reviewselector",
  Inner
);
