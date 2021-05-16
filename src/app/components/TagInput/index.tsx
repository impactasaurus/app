import * as React from "react";
import { TagInput } from "./base";
import {
  TagSuggestionsForBen,
  TagSuggestionsForQuestionnaire,
} from "./suggestions";
import "./style.less";

enum SuggestionSource {
  QUESTIONNAIRE,
  BENEFICIARY,
}

interface IExtProps {
  id: string;
  questionnaireID?: string;
  allowNewTags?: boolean;
  onChange: (tags: string[]) => void;
  tags: string[];
  inputID?: string;
  children?: React.ReactNode;
}

interface IProps extends IExtProps {
  type: SuggestionSource;
}

const TagInputWithSuggestions = (p: IProps): JSX.Element => (
  <div className="record-tag-input-w-suggestions">
    <TagInput
      onChange={p.onChange}
      tags={p.tags}
      allowNewTags={p.allowNewTags}
      id={p.inputID}
    />
    {p.children}
    {p.type === SuggestionSource.BENEFICIARY && (
      <TagSuggestionsForBen onChange={p.onChange} id={p.id} tags={p.tags} />
    )}
    {p.type === SuggestionSource.QUESTIONNAIRE && (
      <TagSuggestionsForQuestionnaire
        onChange={p.onChange}
        id={p.id}
        tags={p.tags}
      />
    )}
  </div>
);

export const TagInputWithBenSuggestions = (p: IExtProps): JSX.Element => (
  <TagInputWithSuggestions {...p} type={SuggestionSource.BENEFICIARY} />
);
export const TagInputWithQuestionnaireSuggestions = (
  p: IExtProps
): JSX.Element => (
  <TagInputWithSuggestions {...p} type={SuggestionSource.QUESTIONNAIRE} />
);
