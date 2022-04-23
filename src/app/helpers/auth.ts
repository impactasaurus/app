import { AuthOptions, LogoutOptions, WebAuth } from "auth0-js";
const appConfig = require("../../../config/main");

export const getDecodedToken = (token: string): any => {
  const urlBase64Decode = (str) => {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += "==";
        break;
      }
      case 3: {
        output += "=";
        break;
      }
      default: {
        throw new Error("Illegal base64url string!");
      }
    }
    return decodeURIComponent(encodeURIComponent(atob(output)));
  };

  const decodeToken = (jwt) => {
    const parts = jwt.split(".");

    if (parts.length !== 3) {
      throw new Error("JWT must have 3 parts");
    }

    const decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error("Cannot decode the token");
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
};

export const getWebAuth = (): WebAuth => {
  const options: AuthOptions = {
    domain: appConfig.app.auth.domain,
    clientID: appConfig.app.auth.clientID,
    scope: appConfig.app.auth.scope,
    responseType: "token id_token",
    redirectUri: `${appConfig.app.root}/login`,
  };

  return new WebAuth(options);
};

export const refreshToken = (): Promise<string> => {
  return new Promise<null>((resolve, reject) => {
    getWebAuth().checkSession({}, (err, authResult) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(authResult.idToken);
    });
  });
};

export const getLogoutOptions = (redirect?: string): LogoutOptions => {
  let returnTo = `${appConfig.app.root}/redirect`;
  if (redirect !== undefined) {
    returnTo = `${returnTo}?redirect=${encodeURI(redirect)}`;
  }

  return {
    returnTo,
    clientID: appConfig.app.auth.clientID,
  };
};

export const timeToExpiry = (expiry: Date): number => {
  return !expiry ? -1 : expiry.getTime() - Date.now();
};
