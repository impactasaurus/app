import {AuthOptions, WebAuth} from 'auth0-js';
const appConfig = require('../../../config/main');

export function getToken(): string|null {
  return localStorage.getItem('token');
}

export function saveAuth(token: string) {
  localStorage.setItem('token', token);
}

export function clearAuth() {
  localStorage.clear();
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

export function getUserID(): string|null {
  const decoded = getDecodedToken();
  if (decoded === null || decoded.sub === undefined) {
    return null;
  }
  return decoded.sub;
}

export function getUserEmail(): string|null {
  const decoded = getDecodedToken();
  if (decoded === null || decoded.email === undefined) {
    return null;
  }
  return decoded.email;
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
