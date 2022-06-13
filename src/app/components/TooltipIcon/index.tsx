import React from "react";
import { Icon, IconProps, Popup } from "semantic-ui-react";

interface IProps {
  i: IconProps;
  tooltipContent: string;
}

export const TooltipIcon = (p: IProps): JSX.Element => {
  const button = <Icon {...p.i} />;
  return <Popup trigger={button} content={p.tooltipContent} />;
};
