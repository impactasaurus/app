import React from "react";
import { Button, ButtonProps, Popup } from "semantic-ui-react";

interface IProps extends ButtonProps {
  tooltipContent: string;
}

export const TooltipButton = (p: IProps): JSX.Element => {
  const button = <Button {...p} />;
  return <Popup trigger={button} content={p.tooltipContent} />;
};
