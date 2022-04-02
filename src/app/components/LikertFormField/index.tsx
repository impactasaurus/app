import React, { useState } from "react";
import { Message, Input, InputProps, Form } from "semantic-ui-react";
import { FormField } from "components/FormField";
import { Likert } from "components/Likert";
import { ILabel, ILikertForm } from "models/question";
import { useTranslation } from "react-i18next";
import "./style.less";

interface ILikertFormFields<T> {
  labels: T;
  leftValue: T;
  rightValue: T;
}

interface IProps {
  onChange(likert: ILikertForm);
  edit: boolean;
  values: ILikertForm;
  errors: ILikertFormFields<string>;
  touched: ILikertFormFields<boolean>;
}

const toInt = (s: string) => parseInt(s, 10);
const addOrEditLabel = (l: ILabel, ls: ILabel[]): ILabel[] => {
  const base = ls.concat().filter((x) => x.value !== l.value);
  if (l.label && l.label.length > 0) {
    base.push(l);
  }
  return base;
};

const replaceLabel = (
  oldVal: number,
  newVal: number,
  label: string,
  labels: ILabel[]
): ILabel[] => {
  const removedOldLabel = addOrEditLabel(
    {
      label: undefined,
      value: oldVal,
    },
    labels
  );
  return addOrEditLabel(
    {
      label,
      value: newVal,
    },
    removedOldLabel
  );
};

export const LikertFormField = (p: IProps): JSX.Element => {
  const [selectedLabel, setSelectedLabel] = useState(p.values.leftValue);
  const [labelSelected, setLabelSelected] = useState<boolean>(false);
  const { t } = useTranslation();

  const setLabelBeingEdited = (val: number) => {
    setSelectedLabel(val);
    setLabelSelected(true);
  };

  const getLeftLabel = (): string => {
    const l = p.values.labels.find((l) => l.value === p.values.leftValue);
    return l === undefined ? undefined : l.label;
  };

  const getRightLabel = (): string => {
    const l = p.values.labels.find((l) => l.value === p.values.rightValue);
    return l === undefined ? undefined : l.label;
  };

  const setLeftValue = (_, data) => {
    let newV = toInt(data.value);
    if (isNaN(newV)) {
      newV = p.values.leftValue;
    }
    setSelectedLabel(undefined);
    p.onChange({
      // also need to update the left label as it will now have a new value
      labels: replaceLabel(
        p.values.leftValue,
        newV,
        getLeftLabel(),
        p.values.labels
      ),
      leftValue: newV,
      rightValue: p.values.rightValue,
    });
  };

  const setRightValue = (_, data) => {
    let newV = toInt(data.value);
    if (isNaN(newV)) {
      newV = p.values.rightValue;
    }
    setSelectedLabel(undefined);
    p.onChange({
      // also need to update the right label as it will now have a new value
      labels: replaceLabel(
        p.values.rightValue,
        newV,
        getRightLabel(),
        p.values.labels
      ),
      leftValue: p.values.leftValue,
      rightValue: newV,
    });
  };

  const setLabel = (_, data) => {
    p.onChange({
      labels: addOrEditLabel(
        {
          value: selectedLabel,
          label: data.value,
        },
        p.values.labels
      ),
      leftValue: p.values.leftValue,
      rightValue: p.values.rightValue,
    });
  };

  const renderLabelControl = (labelSelected: boolean): JSX.Element => {
    const props: InputProps = {};
    if (selectedLabel === undefined) {
      props.disabled = true;
    }
    if (labelSelected) {
      props.autoFocus = true;
    }
    const editedLabel = p.values.labels.find((l) => l.value === selectedLabel);
    const { errors, touched } = p;
    const desc = t("Click a point on the scale to set or edit labels");
    return (
      <FormField
        description={desc}
        key={"fflc-" + selectedLabel}
        error={errors.labels as string}
        touched={touched.labels}
        inputID="lff-labels"
        label={t("Scale Labels")}
        required={true}
      >
        <Input
          {...props}
          id="lff-labels"
          name="labels"
          placeholder={t("Label for highlighted point")}
          value={editedLabel ? editedLabel.label : ""}
          onChange={setLabel}
        />
      </FormField>
    );
  };

  const renderValueInputs = (): JSX.Element => {
    const { errors, touched, values, edit } = p;
    if (edit) {
      return (
        <Message
          content={t(
            "We do not allow the values of the scale to be edited to ensure data consistency. If you would like to change them, please delete this question and recreate it or contact support@impactasaurus.org"
          )}
          info={true}
        />
      );
    }
    return (
      <div>
        <Form.Group>
          <FormField
            error={errors.leftValue as string}
            touched={touched.leftValue}
            inputID="lff-left"
            label={t("Left Value")}
            required={true}
            width={4}
          >
            <Input
              id="lff-left"
              name="leftValue"
              type="number"
              placeholder={t("Left Value")}
              value={values.leftValue}
              onChange={setLeftValue}
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
            <Input
              id="lff-right"
              name="rightValue"
              type="number"
              placeholder={t("Right Value")}
              value={values.rightValue}
              onChange={setRightValue}
            />
          </FormField>
        </Form.Group>
      </div>
    );
  };

  return (
    <div className="likert-form">
      <div className="section mid">{renderValueInputs()}</div>
      <div className="section likert">
        <Likert
          key={`${p.values.leftValue}-${p.values.rightValue}`}
          leftValue={p.values.leftValue}
          rightValue={p.values.rightValue}
          onChange={setLabelBeingEdited}
          disabled={false}
          value={selectedLabel}
          labels={p.values.labels}
        />
      </div>
      <div className="section lower">
        {renderLabelControl(labelSelected === true)}
      </div>
    </div>
  );
};
