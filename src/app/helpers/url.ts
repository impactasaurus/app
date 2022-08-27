export const journeyURI = (
  beneficiary: string,
  questionnaire?: string
): string => {
  let uri = `/beneficiary/${beneficiary}`;
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
    `/beneficiary/${beneficiary}`,
    questionnaire ? new URLSearchParams({ q: questionnaire }) : undefined
  );
};

export const questionnaireURI = (questionnaire: string): string => {
  return `/questions/${questionnaire}`;
};

export const recordURI = (record: string): string => {
  return `/meeting/${record}/view`;
};

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

const isUrlAbsolute = (url) =>
  url.indexOf("://") > 0 || url.indexOf("//") === 0;

const getNext = (
  p: ISearchParam
): null | { url: string; search?: URLSearchParams } => {
  const next = getSearchParam<string | string[]>("next")(p);
  if (next) {
    if (Array.isArray(next)) {
      if (next.length === 1) {
        return { url: next[0] };
      } else if (next.length > 1) {
        const remainingArrayJSON = JSON.stringify(next.splice(1));
        return {
          url: next[0],
          search: new URLSearchParams({ next: remainingArrayJSON }),
        };
      }
    } else if (typeof next === "string") {
      return { url: next };
    }
  }
  return null;
};

export const canBeForwarded = (p: ISearchParam): boolean => getNext(p) !== null;

export const forward = (
  p: ISearchParam,
  setURL: (url: string, search?: URLSearchParams) => void
): boolean => {
  const n = getNext(p);
  if (n !== null) {
    if (isUrlAbsolute(n.url)) {
      window.location.href = n.url;
    } else {
      setURL(n.url, n.search);
    }
    return true;
  }
  return false;
};
