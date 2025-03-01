import React from "react";
import { Label } from "semantic-ui-react";
import "./style.less";
import { IOutcomeSet } from "models/outcomeSet";
import { useTranslation } from "react-i18next";

const FEELINGS_PLUGIN_ID = "feelings-selector";

const FEELING_OPTIONS = [
  "Accepting",
  "Anxious",
  "Apprehensive",
  "Appreciative",
  "Bored",
  "Caring",
  "Compassionate",
  "Concerned",
  "Confused",
  "Curious",
  "Delighted",
  "Despondent",
  "Disappointed",
  "Discouraged",
  "Distant",
  "Doubtful",
  "Edgy",
  "Engaged",
  "Energised",
  "Encouraged",
  "Exhausted",
  "Fascinated",
  "Focused",
  "Fulfilled",
  "Grateful",
  "Indifferent",
  "Inhibited",
  "Inspired",
  "Interested",
  "Involved",
  "Isolated",
  "Joyful",
  "Lethargic",
  "Lucky",
  "Moved",
  "Nervous",
  "Open",
  "Optimistic",
  "Peaceful",
  "Present",
  "Proud",
  "Reflective",
  "Reluctant",
  "Resistant",
  "Restless",
  "Safe",
  "Sceptical",
  "Self-conscious",
  "Sensitive",
  "Shut down",
  "Stimulated",
  "Tense",
  "Thankful",
  "Uplifted",
  "Uneasy",
  "Understood",
  "Unhappy",
  "Upset",
  "Weary",
  "Withdrawn",
  "Worried",
  "Worn out",
];

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
        {FEELING_OPTIONS.map((feeling) => (
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
