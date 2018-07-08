export interface IOrgSettings {
  beneficiaryTypeAhead: boolean;
}

export interface IOrganisation {
  id: string;
  name: string;
  settings: IOrgSettings;
}
