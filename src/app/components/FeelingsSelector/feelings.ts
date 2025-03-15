const FEELING_CATEGORIES: {
  name: string;
  positive: string[];
  negative: string[];
}[] = [
  {
    name: "Connection",
    positive: [
      "Accepting",
      "Appreciative",
      "Caring",
      "Compassionate",
      "Curious",
      "Engaged",
      "Interested",
      "Involved",
      "Safe",
      "Understood",
    ],
    negative: [
      "Resistant",
      "Indifferent",
      "Distant",
      "Self-conscious",
      "Confused",
      "Withdrawn",
      "Bored",
      "Isolated",
      "Uneasy",
      "Misunderstood",
    ],
  },
  {
    name: "Energy",
    positive: [
      "Energised",
      "Encouraged",
      "Fascinated",
      "Focused",
      "Inspired",
      "Joyful",
      "Lucky",
      "Moved",
      "Stimulated",
      "Uplifted",
    ],
    negative: [
      "Exhausted",
      "Discouraged",
      "Apprehensive",
      "Distracted",
      "Doubtful",
      "Worried",
      "Unlucky",
      "Shut down",
      "Weary",
      "Worn out",
    ],
  },
  {
    name: "Emotional Stability",
    positive: [
      "Delighted",
      "Fulfilled",
      "Grateful",
      "Open",
      "Optimistic",
      "Peaceful",
      "Present",
      "Proud",
      "Reflective",
      "Thankful",
    ],
    negative: [
      "Despondent",
      "Unhappy",
      "Upset",
      "Inhibited",
      "Sceptical",
      "Tense",
      "Absent",
      "Reluctant",
      "Uncertain",
      "Concerned",
    ],
  },
];

export const FEELINGS = FEELING_CATEGORIES.reduce<string[]>(
  (acc, category) => [...acc, ...category.positive, ...category.negative],
  []
).sort();

export type FeelingPolarity = "positive" | "negative";

export interface IFeeling {
  name: string;
  category: string;
  polarity: FeelingPolarity;
}

export const getFeelingMetadata = (feeling: string): null | IFeeling => {
  for (const category of FEELING_CATEGORIES) {
    if (category.positive.indexOf(feeling) !== -1) {
      return { name: feeling, category: category.name, polarity: "positive" };
    }
    if (category.negative.indexOf(feeling) !== -1) {
      return { name: feeling, category: category.name, polarity: "negative" };
    }
  }
  return null;
};
