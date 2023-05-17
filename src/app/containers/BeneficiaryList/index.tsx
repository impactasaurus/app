import React from "react";
import {
  IBeneficiariesResult,
  getBeneficiaries,
} from "apollo/modules/beneficiaries";
import { SideList } from "components/SideList";
import { Beneficiary } from "containers/Beneficiary";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface IProps {
  match: {
    params: {
      id: string;
    };
    path: string;
    url: string;
  };
  data: IBeneficiariesResult;
}

const Inner = (p: IProps) => {
  const menuItems = (p.data?.getBeneficiaries || []).map((b) => (
    <Menu.Item
      as={Link}
      to={`/beneficiary/${b}`}
      active={b == p.match.params.id}
      key={b}
    >
      <span>{b}</span>
    </Menu.Item>
  ));
  return (
    <SideList
      data={p.data}
      entity="beneficiaries"
      selected={p?.match?.params?.id}
      menuItems={menuItems}
    >
      <Beneficiary match={p.match} />
    </SideList>
  );
};

export const BeneficiaryList = getBeneficiaries(Inner);
