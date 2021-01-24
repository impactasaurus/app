export interface IOrgSettings {
  beneficiaryTypeAhead: boolean;
}

export interface IOrganisation {
  id: string;
  name: string;
  don: boolean;
  settings: IOrgSettings;
}
