import React from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, InputProps, Popup } from "semantic-ui-react";
import { FormField } from "components/FormField";

interface ILikertValueFields<T> {
  leftValue: T;
  rightValue: T;
}

interface IProps {
  setLeftValue(num: number): void;
  setRightValue(num: number): void;
  switchValues(): void;
  canEdit: boolean;
  values: ILikertValueFields<number>;
  errors: ILikertValueFields<string>;
  touched: ILikertValueFields<boolean>;
}

const InputWithPopupInEdit = (
  p: {
    canEdit: boolean;
  } & InputProps
): JSX.Element => {
  const { t } = useTranslation();
  const { canEdit, ...inputProps } = p;
  const input = <Input {...inputProps} />;
  if (!canEdit) {
    const editMessage = t(
      "We do not allow the values of the scale to be edited to ensure data consistency. If you would like to change them, please delete this question and recreate it or contact support@impactasaurus.org"
    );
    // div here is to make the popup work on a disabled input field
    return <Popup content={editMessage} trigger={<div>{input}</div>} />;
  }
  return input;
};

const toInt = (s: string) => parseInt(s, 10);

export const LikertValueInput = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const { errors, touched, values, canEdit } = p;
  return (
    <div>
      <Form.Group>
        <FormField
          error={errors.leftValue}
          touched={touched.leftValue}
          inputID="lff-left"
          label={t("Left Value")}
          required={true}
          width={4}
        >
          <InputWithPopupInEdit
            canEdit={canEdit}
            id="lff-left"
            name="leftValue"
            type="number"
            placeholder={t("Left Value")}
            value={values.leftValue}
            onChange={(_, d) => p.setLeftValue(toInt(d.value))}
            disabled={!canEdit}
          />
        </FormField>
        <Form.Button
          width={8}
          basic={true}
          content={t("Reverse Scoring")}
          onClick={p.switchValues}
          className="invert"
          icon="exchange"
          disabled={!canEdit}
        />
        <FormField
          error={errors.rightValue as string}
          touched={touched.rightValue}
          inputID="lff-right"
          label={t("Right Value")}
          required={true}
          width={4}
        >
          <InputWithPopupInEdit
            canEdit={canEdit}
            id="lff-right"
            name="rightValue"
            type="number"
            placeholder={t("Right Value")}
            value={values.rightValue}
            onChange={(_, d) => p.setRightValue(toInt(d.value))}
            disabled={!canEdit}
          />
        </FormField>
      </Form.Group>
    </div>
  );
};
