export const journeyURI = (
  beneficiary: string,
  questionnaire?: string
): string => {
  let uri = `/beneficiary/${encodeURIComponent(beneficiary)}`;
  const search = new URLSearchParams();
  if (questionnaire !== undefined && questionnaire !== null) {
    search.append("q", questionnaire);
  }
  if (search.toString().length > 0) {
    uri = `${uri}?${search.toString()}`;
  }
  return uri;
};

export const journey = (
  setURL: (url: string, query?: URLSearchParams) => void,
  beneficiary: string,
  questionnaire?: string
): void => {
  setURL(
    `/beneficiary/${encodeURIComponent(beneficiary)}`,
    questionnaire ? new URLSearchParams({ q: questionnaire }) : undefined
  );
};

export const questionnaireURI = (questionnaire: string): string =>
  `/questions/${questionnaire}`;
export const recordURI = (record: string): string => `/meeting/${record}/view`;
export const meetingURI = (record: string): string => `/meeting/${record}`;
export const externalLinkURI = (url: string): string =>
  `/external/${encodeURIComponent(btoa(url))}`;

export interface ISearchParam {
  location: {
    search: string;
  };
}

export const getSearchParam = <T>(
  key: string,
  fallback?: T | undefined
): ((p: ISearchParam) => T | undefined) => {
  return (p) => {
    const sp = new URLSearchParams(p.location.search);
    if (!sp.has(key)) {
      return fallback;
    }
    const str = sp.get(key);
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };
};

export function getJSONFromURL<T>(
  p: URLSearchParams,
  key: string,
  fallback: T
): T {
  if (p.has(key) === false) {
    return fallback;
  }
  const raw = p.get(key);
  return JSON.parse(raw);
}

export const isUrlAbsolute = (url: string): boolean =>
  url.indexOf("://") > 0 || url.indexOf("//") === 0;

const getNext = (p: ISearchParam): null | { url: string; next?: string[] } => {
  const raw = getSearchParam<string>("next")(p);
  if (!raw) {
    return null;
  }
  let next = raw;
  try {
    // expect base64 encoded array
    next = atob(next);
    next = JSON.parse(next);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(next) || next.length === 0) {
    return null;
  }
  return { url: next[0], next: next.splice(1) };
};

export const forwardURLParam = (next: string[] | string): URLSearchParams => {
  const arr = Array.isArray(next) ? next : [next];
  if (arr.length === 0) {
    return new URLSearchParams();
  }
  return new URLSearchParams({
    next: btoa(JSON.stringify(arr)),
  });
};

export const canBeForwarded = (p: ISearchParam): boolean => getNext(p) !== null;

export const forward = (
  p: ISearchParam,
  setURL: (url: string, search?: URLSearchParams) => void
): boolean => {
  const n = getNext(p);
  if (n === null) {
    return false;
  }
  setURL(
    n.url,
    n.next && n.next.length > 0 ? forwardURLParam(n.next) : undefined
  );
  return true;
};
