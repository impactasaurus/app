import * as React from 'react';
import {Search, Icon, Label} from 'semantic-ui-react';
import './base.less';
import {ITagResult, getTags} from 'apollo/modules/tags';
import * as TagsInput from 'react-tagsinput';

interface IProps {
  onChange: (tags: string[]) => void;
  data?: ITagResult;
  allowNewTags?: boolean;
  tags: string[];
  id?: string;
}

function getMatchingTags(systemTags: string[], selectedTags: string[], q: string) {
  return systemTags
    .filter((t) => selectedTags.indexOf(t) === -1) // don't show tags that have already been selected
    .filter((t) => t.toLowerCase().includes(q.toLowerCase()));
}

const newTagTitle = 'Create a new tag';
const newTagDesc = 'Click here or the plus icon';

class TagInputInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.renderTag = this.renderTag.bind(this);
  }

  private renderTag(props) {
    const {tag, key, disabled, onRemove, getTagDisplayValue} = props;
    const onRemoveLocal = () => {
      if (disabled) {
        return;
      }
      onRemove(key);
    };
    return (
      <Label key={key} as="a" onClick={onRemoveLocal}>
        <span>{getTagDisplayValue(tag)}</span>
        {!disabled &&
        <Icon name="close"/>
        }
      </Label>
    );
  }

  private renderLayout(tagComponents, inputComponent) {
    return (
      <div className="tag-input-container">
        <div className="tag-container">
          {tagComponents}
        </div>
        <div className="input-container">
          {inputComponent}
        </div>
      </div>
    );
  }

  private renderInput(props) {
    const {onChange, value, addTag, ...other} = props;
    const addTagWithVal = () => addTag(value);
    const handleResultSelect = (_, { result }) => {
      if (result.title === newTagTitle) {
        return addTagWithVal();
      }
      addTag(result.title);
    };
    const results: any[] = getMatchingTags(this.props.data.getTags || [], this.props.tags, value)
      .map((t) => ({title: t}));
    let icon;
    if (this.props.allowNewTags !== false) {
      results.push({
        title: newTagTitle,
        description: newTagDesc,
      });
      icon = (<Icon name="add" link={true} onClick={addTagWithVal} />);
    }

    return (
      <Search
        loading={this.props.data.loading}
        onResultSelect={handleResultSelect}
        onSearchChange={onChange}
        results={results}
        open={value.length > 0}
        fluid={true}
        value={value}
        icon={icon}
        noResultsMessage={'No matching tags found'}
        {...other}
      />
    );
  }

  public render() {
    const addOnBlur = false;
    const addKeys = [];
    return (
      <div className="record-tag-input">
        <TagsInput
          id={this.props.id}
          className="tag-input"
          value={this.props.tags}
          onChange={this.props.onChange}
          renderTag={this.renderTag}
          renderInput={this.renderInput}
          renderLayout={this.renderLayout}
          addOnBlur={addOnBlur}
          removeKeys={[]}
          addKeys={addKeys}
        />
      </div>

    );
  }
}

const TagInput = getTags<IProps>(TagInputInner);
export { TagInput };
