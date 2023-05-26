import React from "react";
import "./style.less";
import { Split } from "@geoffcox/react-splitter";
import { Button } from "semantic-ui-react";

interface IProps {
  children: JSX.Element | JSX.Element[];
  selected: string;
  left: JSX.Element;
  minPrimarySize?: string;
  deselect: () => void;
}

export const SideList = (p: IProps): JSX.Element => {
  let minPrimarySize = p.minPrimarySize || "200px";
  let minSecondarySize = "60%";
  if (!p.selected) {
    minPrimarySize = "100%";
    minSecondarySize = "0";
  }
  return (
    <Split
      initialPrimarySize="30%"
      minPrimarySize={minPrimarySize}
      minSecondarySize={minSecondarySize}
    >
      <div className={`left ${p.selected ? "split" : "full"}`}>{p.left}</div>
      {p.selected && (
        <div className="right">
          <Button
            icon="close"
            id="right-close"
            basic={true}
            circular
            onClick={p.deselect}
          />
          {p.children}
        </div>
      )}
    </Split>
  );
};
