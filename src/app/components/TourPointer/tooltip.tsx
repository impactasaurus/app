import React from "react";
import { TooltipButton } from "components/TooltipButton";
import { useTranslation } from "react-i18next";
import { TooltipRenderProps } from "react-joyride";
import { Card } from "semantic-ui-react";
import "./style.less";

export const TourTooltip = (p: TooltipRenderProps): JSX.Element => {
  const { t } = useTranslation();
  const complete = !p.step.nonce || p.step.nonce === "true";
  return (
    <div ref={p.tooltipProps.ref} className="tour-pointer-tooltip">
      <Card>
        <Card.Content extra={true} className="header">
          {p.continuous && p.index < p.size - 1 && (
            <TooltipButton
              buttonProps={{
                icon: "angle right",
                compact: true,
                onClick: p.primaryProps.onClick,
                primary: true,
                disabled: !complete,
              }}
              tooltipContent={t("Next")}
            />
          )}
          <TooltipButton
            buttonProps={{
              icon: "close",
              compact: true,
              onClick: p.skipProps.onClick,
              basic: true,
            }}
            tooltipContent={t("Close")}
          />
        </Card.Content>
        <Card.Content>
          {p.step.title && <Card.Header>{p.step.title}</Card.Header>}
          <Card.Description>{p.step.content}</Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
};
