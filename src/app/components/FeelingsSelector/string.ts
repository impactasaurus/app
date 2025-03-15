import {
  FeelingPolarity,
  getFeelingMetadata,
} from "components/FeelingsSelector/feelings";

export const parseFeelings = (feelingsSection: string): string[] => {
  const feelings: string[] = [];
  const sectionText = feelingsSection.trim();
  let foundNewFormat = false;

  const sections = sectionText.split(" > ").filter((s) => s.trim());

  for (const section of sections) {
    const lines = section.split("\n").filter((l) => l.trim() !== "");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("+") || line.startsWith("-")) {
        foundNewFormat = true;
        const feeling = line.substring(1).trim();
        if (feeling !== "") {
          feelings.push(feeling);
        }
      }
    }
  }

  if (!foundNewFormat && sectionText !== "") {
    const oldFormatFeelings = sectionText.split(",").map((f) => f.trim());
    feelings.push(...oldFormatFeelings);
  }

  return feelings;
};

interface ICategorizedFeelings {
  [category: string]: {
    feeling: string;
    polarity: FeelingPolarity;
  }[];
}

export const printFeelings = (feelings: string[]): string => {
  const categorizedFeelings: ICategorizedFeelings = feelings
    .map(getFeelingMetadata)
    .filter((f) => f !== null)
    .reduce((acc, feeling) => {
      if (!acc[feeling.category]) {
        acc[feeling.category] = [];
      }
      acc[feeling.category].push({
        feeling: feeling.name,
        polarity: feeling.polarity,
      });
      return acc;
    }, {} as ICategorizedFeelings);
  let str = "";
  Object.keys(categorizedFeelings).forEach((c) => {
    str += ` > ${c}\n`;
    categorizedFeelings[c]
      .sort((a, b) => {
        if (a.polarity === b.polarity) {
          return a.feeling.localeCompare(b.feeling);
        } else {
          return a.polarity === "positive" ? -1 : 1;
        }
      })
      .forEach(({ feeling, polarity }) => {
        str += `   ${polarity === "positive" ? "+" : "-"} ${feeling}\n`;
      });
  });
  return str;
};
