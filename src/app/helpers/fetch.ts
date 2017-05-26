const appConfig = require('../../../config/main');
import {getToken} from 'modules/auth';

export class FetchError extends Error {
  public response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export function authFetch(url: string, options?: RequestInit): Promise<any> {
  if (options === undefined) {
    options = {};
  }
  if (options.headers === undefined) {
    options.headers = {};
  }
  options.headers.Accept = 'application/json';
  options.headers['Content-Type'] = 'application/json';

  if (url.includes(appConfig.app.api) && getToken() !== null) {
    options.headers.Authorization = 'Bearer ' + getToken();
  }

  return fetch(url, options)
    .then(checkStatus)
    .then((response) => response.json());
}

export function checkStatus(response: Response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new FetchError(response.statusText, response);
  }
}
