import React from "react";
import { Search, Icon } from "semantic-ui-react";
import { ITagResult, getTags } from "apollo/modules/tags";
import TagsInput from "react-tagsinput";
import { Tag } from "../Tag";
import { useTranslation } from "react-i18next";
import "./base.less";

interface IProps {
  onChange: (tags: string[]) => void;
  data?: ITagResult;
  allowNewTags?: boolean;
  tags: string[];
  id?: string;
}

function getMatchingTags(
  systemTags: string[],
  selectedTags: string[],
  q: string
) {
  return systemTags
    .filter((t) => selectedTags.indexOf(t) === -1) // don't show tags that have already been selected
    .filter((t) => t.toLowerCase().includes(q.toLowerCase()));
}

const renderTag = (props) => {
  const { tag, key, disabled, onRemove, getTagDisplayValue } = props;
  const onRemoveLocal = () => {
    if (disabled) {
      return;
    }
    onRemove(key);
  };

  return (
    <Tag
      key={tag}
      onClick={onRemoveLocal}
      icon="close"
      tag={getTagDisplayValue(tag)}
    />
  );
};

const renderLayout = (tagComponents, inputComponent) => {
  return (
    <div className="tag-input-container">
      <div className="tag-container">{tagComponents}</div>
      <div className="input-container">{inputComponent}</div>
    </div>
  );
};

const TagInputInner = (p: IProps) => {
  const { t } = useTranslation();
  const newTagTitle = t("Create a new tag");
  const newTagDesc = t("Click here or the plus icon");

  const renderInput = (inputProps) => {
    const { onChange, value, addTag, ...other } = inputProps;
    const addTagWithVal = () => addTag(value);
    const handleResultSelect = (_, { result }) => {
      if (result.title === newTagTitle) {
        return addTagWithVal();
      }
      addTag(result.title);
    };
    const results: { title: string; description?: string }[] = getMatchingTags(
      p.data.getTags || [],
      p.tags,
      value
    ).map((t) => ({ title: t }));
    let icon: JSX.Element;
    if (p.allowNewTags !== false) {
      results.push({
        title: newTagTitle,
        description: newTagDesc,
      });
      icon = <Icon name="add" link={true} onClick={addTagWithVal} />;
    }

    return (
      <Search
        loading={p.data.loading}
        onResultSelect={handleResultSelect}
        onSearchChange={onChange}
        results={results}
        open={value.length > 0}
        fluid={true}
        value={value}
        icon={icon}
        noResultsMessage={t("No matching tags found")}
        {...other}
      />
    );
  };

  const addOnBlur = false;
  const addKeys = [];
  return (
    <div className="record-tag-input">
      <TagsInput
        id={p.id}
        className="tag-input"
        value={p.tags}
        onChange={p.onChange}
        renderTag={renderTag}
        renderInput={renderInput}
        renderLayout={renderLayout}
        addOnBlur={addOnBlur}
        removeKeys={[]}
        addKeys={addKeys}
      />
    </div>
  );
};

const TagInput = getTags<IProps>(TagInputInner);
export { TagInput };
