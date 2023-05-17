import React from "react";
import { QueryProps } from "react-apollo";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { Menu } from "semantic-ui-react";
import "./style.less";

interface IProps {
  entity: string;
  data: QueryProps;
  children: JSX.Element | JSX.Element[];
  selected: string;
  menuItems: JSX.Element[];
}

export const SideList = (p: IProps): JSX.Element => {
  const SideList = (): JSX.Element => {
    return <Menu vertical>{p.menuItems}</Menu>;
  };
  const SideListWithLoader = ApolloLoaderHoC(p.entity, () => p.data, SideList, {
    wrapInGrid: false,
  });

  if (!p.selected) {
    return <SideListWithLoader />;
  }

  return (
    <div className="split-pane-container">
      <div className="left">
        <SideListWithLoader />
      </div>
      <div className="right">{p.children}</div>
    </div>
  );
};
