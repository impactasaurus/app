import { FormField } from "components/FormField";
import { ILabel } from "models/question";
import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "semantic-ui-react";

interface IProps {
  selectedLabel: number | null;
  autoFocus?: boolean;
  labels: ILabel[];
  error: string;
  touched: boolean;
  setLabel: (lab: string) => void;
}

export const LikertLabelControl = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const editedLabel = p.labels.find((l) => l.value === p.selectedLabel);
  const desc = t("Click a point on the scale to set or edit labels");
  return (
    <FormField
      description={desc}
      key={"fflc-" + p.selectedLabel}
      error={p.error}
      touched={p.touched}
      inputID="lff-labels"
      label={t("Scale Labels")}
      required={true}
    >
      <Input
        autoFocus={p.autoFocus}
        disabled={p.selectedLabel === null}
        id="lff-labels"
        name="labels"
        placeholder={t("Label for highlighted point")}
        value={editedLabel ? editedLabel.label : ""}
        onChange={(_, d) => p.setLabel(d.value)}
      />
    </FormField>
  );
};
