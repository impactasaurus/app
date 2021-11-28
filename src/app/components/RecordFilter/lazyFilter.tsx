import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";

export const LazyFilter = (p: {
  dropDownText: string;
  children: JSX.Element;
}): JSX.Element => {
  const [clicked, setClicked] = useState(false);
  if (!clicked) {
    return (
      <Dropdown
        className="dropdown-checkbox"
        onClick={() => setClicked(true)}
        text={p.dropDownText}
      ></Dropdown>
    );
  }
  return p.children;
};
