import React from "react";
import { Button, ButtonProps, Popup } from "semantic-ui-react";

interface IProps {
  buttonProps: ButtonProps;
  tooltipContent: string;
}

export const TooltipButton = (p: IProps): JSX.Element => {
  const button = <Button {...p.buttonProps} />;
  return <Popup trigger={button} content={p.tooltipContent} />;
};
