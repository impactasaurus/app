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
  edit: boolean;
  values: ILikertValueFields<number>;
  errors: ILikertValueFields<string>;
  touched: ILikertValueFields<boolean>;
}

const InputWithPopupInEdit = (
  p: {
    editing: boolean;
  } & InputProps
): JSX.Element => {
  const { t } = useTranslation();
  const input = <Input {...p} />;
  if (p.editing) {
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
  const { errors, touched, values, edit } = p;
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
            editing={edit}
            id="lff-left"
            name="leftValue"
            type="number"
            placeholder={t("Left Value")}
            value={values.leftValue}
            onChange={(_, d) => p.setLeftValue(toInt(d.value))}
            disabled={edit}
          />
        </FormField>
        <Form.Input className="padding" width={8} />
        <FormField
          error={errors.rightValue as string}
          touched={touched.rightValue}
          inputID="lff-right"
          label={t("Right Value")}
          required={true}
          width={4}
        >
          <InputWithPopupInEdit
            editing={edit}
            id="lff-right"
            name="rightValue"
            type="number"
            placeholder={t("Right Value")}
            value={values.rightValue}
            onChange={(_, d) => p.setRightValue(toInt(d.value))}
            disabled={edit}
          />
        </FormField>
      </Form.Group>
    </div>
  );
};
