import React from "react";
import { TooltipButton } from "components/TooltipButton";
import { useTranslation } from "react-i18next";
import { TooltipRenderProps } from "react-joyride";
import { Button, Card } from "semantic-ui-react";

export const TourTooltip = (p: TooltipRenderProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div ref={p.tooltipProps.ref} style={{ maxWidth: "350px" }}>
      <Card>
        <Card.Content>
          {p.step.title && <Card.Header>{p.step.title}</Card.Header>}
          <Card.Description>{p.step.content}</Card.Description>
        </Card.Content>
        {p.continuous && (
          <Card.Content extra={true} style={{ textAlign: "right" }}>
            <Button.Group icon>
              {p.index < p.size - 1 && (
                <TooltipButton
                  icon="close"
                  compact={true}
                  onClick={p.skipProps.onClick}
                  tooltipContent={t("Skip")}
                />
              )}
              {p.index > 0 && (
                <TooltipButton
                  icon="angle left"
                  compact={true}
                  onClick={p.backProps.onClick}
                  tooltipContent={t("Back")}
                />
              )}
              {p.index < p.size - 1 && (
                <TooltipButton
                  icon="angle right"
                  compact={true}
                  onClick={p.primaryProps.onClick}
                  tooltipContent={t("Next")}
                />
              )}
            </Button.Group>
          </Card.Content>
        )}
      </Card>
    </div>
  );
};
