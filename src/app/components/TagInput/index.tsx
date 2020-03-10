import * as React from 'react';
import {TagInput} from './base';
import {suggestTags, ISuggestTagsResult, suggestQuestionnaireTags} from 'apollo/modules/tags';
import {renderArray} from '../../helpers/react';
import {isNullOrUndefined} from 'util';
import './style.less';
import {Tag} from '../Tag';

interface IProps {
  data?: ISuggestTagsResult;
  id: string;

  // pass through to RecordTagInput
  allowNewTags?: boolean;
  onChange: (tags: string[]) => void;
  tags: string[];
  inputID?: string;
}

function filterAlreadySelectedTags(suggested: string[], selected: string[]) {
  return suggested.filter((t) => selected.indexOf(t) === -1);
}

class TagInputWithSuggestionsInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderTag = this.renderTag.bind(this);
    this.renderSuggested = this.renderSuggested.bind(this);
    this.addTag = this.addTag.bind(this);
  }

  private addTag(t: string): () => void {
    return () => this.props.onChange(this.props.tags.concat(t));
  }

  private renderTag(tag: string): JSX.Element {
    return (
      <Tag
        key={tag}
        onClick={this.addTag(tag)}
        icon="plus"
        tag={tag}
      />
    );
  }

  private renderSuggested(props: IProps): JSX.Element {
    const wrap = (inner: JSX.Element): JSX.Element => {
      return ((
        <div>
          <h4 className="label suggestions">Suggested Tags</h4>
          {inner}
        </div>
      ));
    };
    if (isNullOrUndefined(props.data)) {
      return wrap(<span>Suggested tags will appear here</span>);
    }
    if (isNullOrUndefined(props.data.error) === false) {
      return wrap(<span>Failed to load suggested tags - sorry</span>);
    }
    if (props.data.loading) {
      return wrap(<span>Loading...</span>);
    }
    if (props.data.suggestedTags.length === 0) {
      return wrap(<span>No tag suggestions available</span>);
    }
    const unselectedSuggestedTags = filterAlreadySelectedTags(props.data.suggestedTags, props.tags);
    if (unselectedSuggestedTags.length === 0) {
      return wrap(<span>All suggested tags selected</span>);
    }
    return wrap((
      <span>
      {renderArray<string>(this.renderTag, unselectedSuggestedTags)}
    </span>
    ));
  }

  public render() {
    return (
      <div className="record-tag-input-w-suggestions">
        <TagInput
          onChange={this.props.onChange}
          tags={this.props.tags}
          allowNewTags={this.props.allowNewTags}
          id={this.props.inputID}
        />
        {this.props.children}
        {this.renderSuggested(this.props)}
      </div>
    );
  }
}

const getID = (p: IProps) => p.id;
export const TagInputWithBenSuggestions = suggestTags<IProps>(getID)(TagInputWithSuggestionsInner);
export const TagInputWithQuestionnaireSuggestions = suggestQuestionnaireTags<IProps>(getID)(TagInputWithSuggestionsInner);
