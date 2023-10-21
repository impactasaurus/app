import { IOrganisation } from "models/organisation";

export const pluginActive = (org: IOrganisation, plugin: string): boolean => {
  const plugins = org?.plugins;
  return plugins && plugins.findIndex((p) => p.id === plugin) != -1;
};
