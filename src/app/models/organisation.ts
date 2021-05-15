export interface IOrgSettings {
  beneficiaryTypeAhead: boolean;
}

export interface IPlugin {
  id: string;
}

export interface IOrganisation {
  id: string;
  name: string;
  don: boolean;
  settings: IOrgSettings;
  plugins: IPlugin[];
}
