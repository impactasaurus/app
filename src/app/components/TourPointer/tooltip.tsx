import React from "react";
import { TooltipButton } from "components/TooltipButton";
import { useTranslation } from "react-i18next";
import { TooltipRenderProps } from "react-joyride";
import { Card } from "semantic-ui-react";

export const TourTooltip = (p: TooltipRenderProps): JSX.Element => {
  const { t } = useTranslation();
  const complete = !p.step.nonce || p.step.nonce === "true";
  return (
    <div ref={p.tooltipProps.ref} style={{ maxWidth: "350px" }}>
      <Card>
        <Card.Content>
          {p.step.title && <Card.Header>{p.step.title}</Card.Header>}
          <Card.Description>{p.step.content}</Card.Description>
        </Card.Content>
        {p.continuous && p.index < p.size - 1 && (
          <Card.Content extra={true} style={{ textAlign: "right" }}>
            <TooltipButton
              icon="close"
              compact={true}
              onClick={p.skipProps.onClick}
              tooltipContent={t("Skip")}
              basic={true}
            />
            <TooltipButton
              icon="angle right"
              compact={true}
              onClick={p.primaryProps.onClick}
              tooltipContent={t("Next")}
              primary={true}
              disabled={!complete}
            />
          </Card.Content>
        )}
      </Card>
    </div>
  );
};
