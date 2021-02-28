import * as React from 'react';
import {renderArray} from '../../helpers/react';
import {isNullOrUndefined} from 'util';
import {suggestTags, ISuggestTagsResult, suggestQuestionnaireTags} from 'apollo/modules/tags';
import {Tag} from '../Tag';
import {useTranslation} from 'react-i18next';

interface IProps {
  id: string;
  data?: ISuggestTagsResult;
  onChange: (tags: string[]) => void;
  tags: string[];
}

const filterAlreadySelectedTags = (suggested: string[], selected: string[]): string[] => {
  return suggested.filter((t) => selected.indexOf(t) === -1);
}

const TagSuggestions = (p: IProps) => {
  const {t} = useTranslation();
  const addTag = (t: string): () => void => {
    return () => p.onChange(p.tags.concat(t));
  }
  const renderTag = (tag: string): JSX.Element => <Tag key={tag} onClick={addTag(tag)} icon="plus" tag={tag} />;
  const wrap = (inner: JSX.Element): JSX.Element => (
    <div>
      <h4 className="label suggestions">{t("Suggested Tags")}</h4>
      {inner}
    </div>
  );
  if (isNullOrUndefined(p.data)) {
    return wrap(<span>{t("Suggested tags will appear here")}</span>);
  }
  if (isNullOrUndefined(p.data.error) === false) {
    return wrap(<span>{t("Failed to load suggested tags - sorry")}</span>);
  }
  if (p.data.loading) {
    return wrap(<span>{t("Loading...")}</span>);
  }
  if (p.data.suggestedTags.length === 0) {
    return wrap(<span>{t("No tag suggestions available")}</span>);
  }
  const unselectedSuggestedTags = filterAlreadySelectedTags(p.data.suggestedTags, p.tags);
  if (unselectedSuggestedTags.length === 0) {
    return wrap(<span>{t("All suggested tags selected")}</span>);
  }
  return wrap((
    <span>
      {renderArray<string>(renderTag, unselectedSuggestedTags)}
    </span>
  ));
}

const getID = (p: IProps) => p.id;
export const TagSuggestionsForBen = suggestTags<IProps>(getID)(TagSuggestions);
export const TagSuggestionsForQuestionnaire = suggestQuestionnaireTags<IProps>(getID)(TagSuggestions);
