import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { getOrganisation, IGetOrgResult } from "apollo/modules/organisation";
import { Link } from "react-router-dom";
import { pluginActive } from "helpers/organisation";

interface IProps {
  org?: IGetOrgResult;
  isActive: (url: string) => boolean;
}

const buttonTitle = "SVE"; // name of product, so not translating

const HeaderPluginsInner = (p: IProps): JSX.Element[] => {
  const items: JSX.Element[] = [];
  if (pluginActive(p.org?.getOrganisation, "sve")) {
    items.push(
      <Menu.Item
        as={Link}
        key="sve"
        to="/plugin/sve"
        active={p.isActive("/plugin/sve")}
      >
        <Icon name="cogs" className="replacement" />
        <span className="title">{buttonTitle}</span>
      </Menu.Item>
    );
  }
  return items;
};

export const HeaderPlugins = getOrganisation<IProps>(HeaderPluginsInner, "org");
