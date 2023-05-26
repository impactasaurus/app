import React from "react";
import {
  IBeneficiariesResult,
  getBeneficiaries,
} from "apollo/modules/beneficiaries";
import { SideList } from "components/SideList";
import { Beneficiary } from "containers/Beneficiary";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";

interface IProps {
  match: {
    params: {
      id: string;
    };
    path: string;
    url: string;
  };
}

const MenuItemsInner = (p: {
  data?: IBeneficiariesResult;
  activeID: string;
}) => {
  const menuItems = (p.data?.getBeneficiaries || []).map((b) => (
    <Menu.Item
      as={Link}
      to={`/beneficiary/${b}`}
      active={b == p.activeID}
      key={b}
    >
      <span>{b}</span>
    </Menu.Item>
  ));
  return <Menu vertical>{menuItems}</Menu>;
};
export const MenuItems = ApolloLoaderHoC<{
  data?: IBeneficiariesResult;
  activeID: string;
}>("beneficiaries", (p) => p.data, getBeneficiaries(MenuItemsInner), {
  wrapInGrid: false,
});

export const BeneficiaryList = (p: IProps) => {
  return (
    <SideList
      left={<MenuItems activeID={p?.match?.params?.id} />}
      selected={p?.match?.params?.id}
    >
      <Beneficiary match={p.match} />
    </SideList>
  );
};
