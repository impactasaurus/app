export const journey = (setURL: (url: string, query?: string) => void, beneficiary: string, questionnaire?: string) => {
  const search = new URLSearchParams();
  if (questionnaire !== undefined) {
    search.append('q', questionnaire);
  }
  let searchString: string;
  if (search.toString().length > 0) {
    searchString = `?${search.toString()}`;
  }
  setURL(`/beneficiary/${beneficiary}`, searchString);
};

export const questionnaire = (setURL: (url: string, query?: string) => void, questionnaire: string) => {
  setURL(`/questions/${questionnaire}`);
};

export const record = (setURL: (url: string, query?: string) => void, record: string) => {
  setURL(`/meeting/${record}/view`);
};
