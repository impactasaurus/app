import {gql} from 'react-apollo';

export interface IUserProfile {
  name: string;
}

export interface ISettings {
  unsubscribed: boolean;
}

export interface ISelf {
  profile: IUserProfile;
  settings: ISettings;
}

export interface ISelfPatch {
  unsubscribed: boolean;
  name: string;
}

export const profileFragment = gql`
  fragment defaultProfile on User {
    id
    name
  }`;

export const selfFragment = gql`
  fragment defaultSelf on Self {
    profile {
      ...defaultProfile
    }
    settings {
      unsubscribed
    }
  } ${profileFragment}`;
