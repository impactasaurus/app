import * as React from "react";
import { Message, Input, InputProps, Form } from "semantic-ui-react";
import { FormField } from "components/FormField";
import { Likert } from "components/Likert";
import "./style.less";
import { ILabel, ILikertForm } from "models/question";
import { isNullOrUndefined } from "util";
import { withTranslation, WithTranslation } from "react-i18next";

interface ILikertFormFields<T> {
  labels: T;
  leftValue: T;
  rightValue: T;
}

interface IProps extends WithTranslation {
  onChange(likert: ILikertForm);
  edit: boolean;
  values: ILikertForm;
  errors: ILikertFormFields<string>;
  touched: ILikertFormFields<boolean>;
}

interface IState {
  selectedLabel?: number;
  labelSelected?: boolean;
}

const toInt = (s: string) => parseInt(s, 10);
const addOrEditLabel = (l: ILabel, ls: ILabel[]): ILabel[] => {
  const base = ls.concat().filter((x) => x.value !== l.value);
  if (!isNullOrUndefined(l.label) && l.label.length > 0) {
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

class LikertFormFieldInner extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLabel: props.values.leftValue,
    };
    this.setLabelBeingEdited = this.setLabelBeingEdited.bind(this);
    this.setLeftValue = this.setLeftValue.bind(this);
    this.setRightValue = this.setRightValue.bind(this);
    this.renderValueInputs = this.renderValueInputs.bind(this);
    this.setLabel = this.setLabel.bind(this);
    this.getLeftLabel = this.getLeftLabel.bind(this);
    this.getRightLabel = this.getRightLabel.bind(this);
    this.renderLabelControl = this.renderLabelControl.bind(this);
  }

  private setLabelBeingEdited(val: number) {
    this.setState({
      selectedLabel: val,
      labelSelected: true,
    });
  }

  private getLeftLabel(): string {
    const l = this.props.values.labels.find(
      (l) => l.value === this.props.values.leftValue
    );
    return l === undefined ? undefined : l.label;
  }

  private getRightLabel(): string {
    const l = this.props.values.labels.find(
      (l) => l.value === this.props.values.rightValue
    );
    return l === undefined ? undefined : l.label;
  }

  private setLeftValue(_, data) {
    let newV = toInt(data.value);
    if (isNaN(newV)) {
      newV = this.props.values.leftValue;
    }
    this.setState({
      selectedLabel: undefined,
    });
    this.props.onChange({
      // also need to update the left label as it will now have a new value
      labels: replaceLabel(
        this.props.values.leftValue,
        newV,
        this.getLeftLabel(),
        this.props.values.labels
      ),
      leftValue: newV,
      rightValue: this.props.values.rightValue,
    });
  }

  private setRightValue(_, data) {
    let newV = toInt(data.value);
    if (isNaN(newV)) {
      newV = this.props.values.rightValue;
    }
    this.setState({
      selectedLabel: undefined,
    });
    this.props.onChange({
      // also need to update the right label as it will now have a new value
      labels: replaceLabel(
        this.props.values.rightValue,
        newV,
        this.getRightLabel(),
        this.props.values.labels
      ),
      leftValue: this.props.values.leftValue,
      rightValue: newV,
    });
  }

  private setLabel(_, data) {
    this.props.onChange({
      labels: addOrEditLabel(
        {
          value: this.state.selectedLabel,
          label: data.value,
        },
        this.props.values.labels
      ),
      leftValue: this.props.values.leftValue,
      rightValue: this.props.values.rightValue,
    });
  }

  private renderLabelControl(labelSelected: boolean): JSX.Element {
    const props: InputProps = {};
    if (this.state.selectedLabel === undefined) {
      props.disabled = true;
    }
    if (labelSelected) {
      props.autoFocus = true;
    }
    const editedLabel = this.props.values.labels.find(
      (l) => l.value === this.state.selectedLabel
    );
    const { errors, touched, t } = this.props;
    const desc = t("Click a point on the scale to set or edit labels");
    return (
      <FormField
        description={desc}
        key={"fflc-" + this.state.selectedLabel}
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
          onChange={this.setLabel}
        />
      </FormField>
    );
  }

  private renderValueInputs(): JSX.Element {
    const { errors, touched, values, t, edit } = this.props;
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
              onChange={this.setLeftValue}
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
              onChange={this.setRightValue}
            />
          </FormField>
        </Form.Group>
      </div>
    );
  }

  public render() {
    return (
      <div className="likert-form">
        <div className="section mid">{this.renderValueInputs()}</div>
        <div className="section likert">
          <Likert
            key={`${this.props.values.leftValue}-${this.props.values.rightValue}`}
            leftValue={this.props.values.leftValue}
            rightValue={this.props.values.rightValue}
            onChange={this.setLabelBeingEdited}
            disabled={false}
            value={this.state.selectedLabel}
            labels={this.props.values.labels}
          />
        </div>
        <div className="section lower">
          {this.renderLabelControl(this.state.labelSelected === true)}
        </div>
      </div>
    );
  }
}

const LikertFormField = withTranslation()(LikertFormFieldInner);
export { LikertFormField };
