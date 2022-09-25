import React from "react";
import { BasicQuestionnaireSelector } from "components/QuestionnaireSelect/basic";
import { TooltipButton } from "components/TooltipButton";
import { useTranslation } from "react-i18next";
import { Handle } from "components/Handle";
import { SortableElement } from "react-sortable-hoc";

interface IProps {
  key: string;
  onChange: (qsID: string) => void;
  onBlur?: () => void;
  questionnaireID?: string;
  onRemove: () => void;
}

const Inner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div key={p.key} className="seq-questionnaire-item">
      <Handle draggable={true} />
      <BasicQuestionnaireSelector
        onChange={p.onChange}
        onBlur={p.onBlur}
        questionnaireID={p.questionnaireID}
      />
      <TooltipButton
        buttonProps={{ icon: "close", onClick: p.onRemove }}
        tooltipContent={t("Remove")}
      />
    </div>
  );
};

export const SeqQuestionnaireItem = SortableElement(Inner);
