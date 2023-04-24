import React from "react";
import { Popup } from "semantic-ui-react";

interface IProps {
  color: string;
  label?: string;
}

export const Swatch = (p: IProps): JSX.Element => {
  return (
    <Popup
      trigger={
        <span
          style={{
            backgroundColor: p.color,
            width: "25px",
            height: "25px",
            display: "inline-block",
          }}
        ></span>
      }
      content={p.label || p.color}
    />
  );
};
