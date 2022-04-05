import React, { useState } from "react";
import { Likert } from "components/Likert";
import { ILabel, ILikertForm } from "models/question";
import { LikertValueInput } from "./scoreInput";
import { LikertLabelControl } from "./labelInput";
import { useNonInitialMemo } from "helpers/hooks/useNonInitialMemo";
import { flipLabelsAroundMidPoint } from "helpers/questionnaire";
import "./style.less";

interface ILikertFormFields<T> {
  labels: T;
  leftValue: T;
  rightValue: T;
}

interface IProps {
  onChange(likert: ILikertForm);
  canEdit: boolean;
  values: ILikertForm;
  errors: ILikertFormFields<string>;
  touched: ILikertFormFields<boolean>;
}

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
  const [selectedLabel, setSelectedLabel] = useState<number | undefined>(
    p.values.leftValue
  );
  const labelAutoFocus = useNonInitialMemo(
    () => selectedLabel !== undefined,
    false,
    [selectedLabel]
  );

  const getLeftLabel = (): string => {
    const l = p.values.labels.find((l) => l.value === p.values.leftValue);
    return l === undefined ? undefined : l.label;
  };

  const getRightLabel = (): string => {
    const l = p.values.labels.find((l) => l.value === p.values.rightValue);
    return l === undefined ? undefined : l.label;
  };

  const setLeftValue = (newV) => {
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

  const setRightValue = (newV) => {
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

  const switchValues = () => {
    setSelectedLabel(undefined);
    p.onChange({
      labels: flipLabelsAroundMidPoint(
        p.values.labels,
        p.values.leftValue,
        p.values.rightValue
      ),
      leftValue: p.values.rightValue,
      rightValue: p.values.leftValue,
    });
  };

  const setLabel = (label) => {
    p.onChange({
      labels: addOrEditLabel(
        {
          value: selectedLabel,
          label,
        },
        p.values.labels
      ),
      leftValue: p.values.leftValue,
      rightValue: p.values.rightValue,
    });
  };

  return (
    <div className="likert-form">
      <div className="section mid">
        <LikertValueInput
          canEdit={p.canEdit}
          errors={{
            leftValue: p.errors.leftValue,
            rightValue: p.errors.rightValue,
          }}
          touched={{
            leftValue: p.touched.leftValue,
            rightValue: p.touched.rightValue,
          }}
          values={{
            leftValue: p.values.leftValue,
            rightValue: p.values.rightValue,
          }}
          setLeftValue={setLeftValue}
          setRightValue={setRightValue}
          switchValues={switchValues}
        />
      </div>
      <div className="section likert">
        <Likert
          key={`${p.values.leftValue}-${p.values.rightValue}`}
          leftValue={p.values.leftValue}
          rightValue={p.values.rightValue}
          onChange={setSelectedLabel}
          disabled={false}
          value={selectedLabel}
          labels={p.values.labels}
        />
      </div>
      <div className="section lower">
        <LikertLabelControl
          selectedLabel={selectedLabel}
          autoFocus={labelAutoFocus}
          setLabel={setLabel}
          error={p.errors.labels}
          touched={p.touched.labels}
          labels={p.values.labels}
        />
      </div>
    </div>
  );
};
