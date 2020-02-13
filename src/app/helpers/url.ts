export const journeyURI = (beneficiary: string, questionnaire?: string): string => {
  let uri = `/beneficiary/${beneficiary}`;
  const search = new URLSearchParams();
  if (questionnaire !== undefined) {
    search.append('q', questionnaire);
  }
  if (search.toString().length > 0) {
    uri = `${uri}?${search.toString()}`;
  }
  return uri;
};

export const journey = (setURL: (url: string, query?: string) => void, beneficiary: string, questionnaire?: string) => {
  const uri = journeyURI(beneficiary, questionnaire);
  const parts = uri.split('?');
  setURL(parts[0], parts.length > 1 ? parts[1] : undefined);
};

export const questionnaireURI = (questionnaire: string): string => {
  return `/questions/${questionnaire}`;
};

export const questionnaire = (setURL: (url: string, query?: string) => void, questionnaire: string) => {
  setURL(questionnaireURI(questionnaire));
};

export const recordURI = (record: string): string => {
  return `/meeting/${record}/view`;
};

export const record = (setURL: (url: string, query?: string) => void, record: string) => {
  setURL(recordURI(record));
};
