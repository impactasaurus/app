import React from "react";
import { Label } from "semantic-ui-react";
import "./style.less";

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
  selectedWords: string[];
  onChange: (words: string[]) => void;
}

export const FeelingsSelector = (p: IProps): JSX.Element => {
  const toggleWord = (word: string) => {
    p.onChange(
      p.selectedWords.indexOf(word) !== -1
        ? p.selectedWords.filter((w) => w !== word)
        : [...p.selectedWords, word]
    );
  };

  return (
    <div className="feelings-selector">
      <div className="feelings-prompt">{t("What are you feeling?")}:</div>
      <div className="feelings-container">
        {FEELING_OPTIONS.map((word) => (
          <Label
            key={word}
            as="a"
            onClick={() => toggleWord(word)}
            className={
              p.selectedWords.indexOf(word) !== -1 ? "selected" : undefined
            }
          >
            {word}
          </Label>
        ))}
      </div>
    </div>
  );
};
