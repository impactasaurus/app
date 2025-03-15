import React from "react";
import { Label } from "semantic-ui-react";
import "./style.less";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";
import { FEELINGS } from "components/FeelingsSelector/feelings";

const FEELINGS_PLUGIN_ID = "feelings-selector";

interface IProps {
  selectedFeelings: string[];
  onChange: (feelings: string[]) => void;
  outcomeSet: IOutcomeSet;
}

export const FeelingsSelector = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const pluginActive = p.outcomeSet.plugins.some(
    (p) => p.id === FEELINGS_PLUGIN_ID
  );
  if (!pluginActive) {
    return null;
  }

  const toggleFeeling = (feeling: string) => {
    p.onChange(
      p.selectedFeelings.indexOf(feeling) !== -1
        ? p.selectedFeelings.filter((w) => w !== feeling)
        : [...p.selectedFeelings, feeling]
    );
  };

  return (
    <div className="feelings-selector">
      <div className="feelings-prompt">{t("What are you feeling?")}:</div>
      <div className="feelings-container">
        {FEELINGS.map((feeling) => (
          <Label
            key={feeling}
            as="a"
            onClick={() => toggleFeeling(feeling)}
            className={
              p.selectedFeelings.indexOf(feeling) !== -1
                ? "selected"
                : undefined
            }
          >
            {feeling}
          </Label>
        ))}
      </div>
    </div>
  );
};
