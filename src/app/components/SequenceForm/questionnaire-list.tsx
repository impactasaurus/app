import { TooltipButton } from "components/TooltipButton";
import React from "react";
import { useTranslation } from "react-i18next";
import { SortableContainer } from "react-sortable-hoc";
import { SeqQuestionnaireItem } from "./questionnaire-item";

interface IProps {
  questionnaires: {
    key: string;
    id: string;
  }[];
  onChange: (index: number) => (id: string) => void;
  addQuestionnaire: () => void;
  onRemove: (index: number) => () => void;
}

const Inner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div id="rf-qid">
      {p.questionnaires.map((q, index) => (
        <SeqQuestionnaireItem
          index={index}
          key={q.key}
          onChange={p.onChange(index)}
          questionnaireID={q.id}
          onRemove={p.onRemove(index)}
        />
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <TooltipButton
          buttonProps={{
            icon: "plus",
            onClick: p.addQuestionnaire,
            type: "button",
          }}
          tooltipContent={t("Add Questionnaire")}
        />
      </div>
    </div>
  );
};

export const SeqQuestionnaireList = SortableContainer(Inner);
