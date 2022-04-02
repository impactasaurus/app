import * as React from "react";
import { SortableHandle } from "react-sortable-hoc";
import SolidGrip from "./grip-vertical-solid.svg";
import Grip from "./grip-vertical.svg";
import { Image } from "semantic-ui-react";

interface IProps {
  draggable: boolean;
}

const HandleInner = (p: IProps): JSX.Element => {
  const style = {
    height: "0.8em",
    paddingLeft: "0.1em",
    marginRight: "0.3em",
  };
  const props = {
    draggable: "false", // avoid normal HTML5 dragging
  };
  if (!p.draggable) {
    return (
      <Image
        src={Grip}
        style={{
          ...style,
          cursor: "not-allowed",
        }}
        {...props}
      />
    );
  }
  return (
    <Image
      src={SolidGrip}
      style={{
        ...style,
        cursor: "move",
      }}
      {...props}
    />
  );
};

export const Handle = SortableHandle(HandleInner);
