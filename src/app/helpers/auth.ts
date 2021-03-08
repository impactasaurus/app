import {AuthOptions, LogoutOptions, WebAuth} from 'auth0-js';
const appConfig = require('../../../config/main');

const localStorageKey = 'token';

export function getToken(): string|null {
  return localStorage.getItem('token');
}

export function saveAuth(token: string): void {
  localStorage.setItem(localStorageKey, token);
}

export function clearAuth(): void {
  localStorage.removeItem(localStorageKey);
}

function getDecodedToken(inputToken?: string) {
  const token = inputToken || getToken();

  const urlBase64Decode = (str) => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return decodeURIComponent(encodeURIComponent(atob(output)));
  };

  const decodeToken = (jwt) => {
    const parts = jwt.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    const decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  };

  if (token === undefined || token === null) {
    return null;
  }
  try {
    return decodeToken(token);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getExpiryDateOfToken(token: string): Date|null {
  const decoded = getDecodedToken(token);
  if (decoded === null || decoded.exp === undefined) {
    return null;
  }
  return new Date(decoded.exp * 1000);
}

export function getExpiryDate(): Date|null {
  return getExpiryDateOfToken(getToken());
}

function getKeyOrNull(k: string): string|null {
  const decoded = getDecodedToken();
  if (decoded === null || decoded[k] === undefined) {
    return null;
  }
  return decoded[k];
}

export function getUserID(): string|null {
  return getKeyOrNull('sub');
}

export function getUserEmail(): string|null {
  return getKeyOrNull('email');
}

export function getUserName(): string|null {
  return getKeyOrNull('name');
}

export function getOrganisation(): string|null {
  return getKeyOrNull('https://app.impactasaurus.org/organisation');
}

export function getCreatedDate(): string|null {
  return getKeyOrNull('https://app.impactasaurus.org/created_at');
}

export function isBeneficiaryUser(): boolean {
  const decoded = getDecodedToken();
  if (decoded !== null && decoded['https://app.impactasaurus.org/beneficiary'] !== undefined) {
    return decoded['https://app.impactasaurus.org/beneficiary'];
  }
  if (decoded === null || decoded.app_metadata === undefined || decoded.app_metadata.beneficiary === undefined) {
    return false;
  }
  return decoded.app_metadata.beneficiary;
}

export function getBeneficiaryScope(): string|null {
  const decoded = getDecodedToken();
  if (decoded !== null && decoded['https://app.impactasaurus.org/scope'] !== undefined) {
    return decoded['https://app.impactasaurus.org/scope'];
  }
  if (decoded === null || decoded.app_metadata === undefined || decoded.app_metadata.scope === undefined) {
    return null;
  }
  return decoded.app_metadata.scope;
}

export function getWebAuth(): WebAuth {
  const options: AuthOptions = {
    domain: appConfig.app.auth.domain,
    clientID: appConfig.app.auth.clientID,
    scope: appConfig.app.auth.scope,
    responseType: 'token id_token',
    redirectUri: `${appConfig.app.root}/login`,
  };

  return new WebAuth(options);
}

export const refreshToken = (): Promise<null> => {
  return new Promise<null>((resolve, reject) => {
    getWebAuth().checkSession({}, (err, authResult) => {
      if(err) {
        reject(err);
        return;
      }
      saveAuth(authResult.idToken);
      resolve(null);
    });
  });
};

export function getLogoutOptions(redirect?: string): LogoutOptions {
  let returnTo = `${appConfig.app.root}/redirect`;
  if (redirect !== undefined) {
    returnTo = `${returnTo}?redirect=${encodeURI(redirect)}`;
  }

  return {
    returnTo,
    clientID: appConfig.app.auth.clientID,
  };
}
