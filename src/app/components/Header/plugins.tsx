import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { getOrganisation, IGetOrgResult } from "apollo/modules/organisation";
import {Link} from 'react-router-dom';

interface IProps {
  org?: IGetOrgResult;
  isActive:(url: string) => boolean;
}

const buttonTitle = "SVE"; // name of product, so not translating

const HeaderPluginsInner = (p: IProps): JSX.Element[] => {
  const plugins = p.org?.getOrganisation?.plugins;
  const pluginActive = (pluginID: string): boolean => {
    return plugins && plugins.findIndex((p) => p.id === pluginID) != -1;
  }
  const items: JSX.Element[] = [];
  if (pluginActive("sve")) {
    items.push((
      <Menu.Item as={Link} to="/plugin/sve" active={p.isActive('/plugin/sve')}>
        <Icon name="cogs" className="replacement" />
        <span className="title">{buttonTitle}</span>
      </Menu.Item>
    ))
  }
  return items;
}

export const HeaderPlugins = getOrganisation<IProps>(HeaderPluginsInner, "org");
