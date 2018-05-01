import * as React from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {RecordTagInput} from 'components/RecordTagInput';
import {suggestTags, ISuggestTagsResult} from 'apollo/modules/tags';
import {renderArray} from '../../helpers/react';
import {isNullOrUndefined} from 'util';

interface IProps {
  data?: ISuggestTagsResult;
  beneficiary: string;

  // pass through to RecordTagInput
  allowNewTags?: boolean;
  onChange: (tags: string[]) => void;
  tags: string[];
}

function renderTag(tag: string): JSX.Element {
  return(
    <Label as="a" key={tag}>
      {tag}
      <Icon name="add"/>
    </Label>
  );
}

function renderSuggested(props: IProps): JSX.Element {
  if (isNullOrUndefined(props.data)) {
    return (<div />);
  }
  const wrap = (inner: JSX.Element): JSX.Element => {
    return ((
      <div>
        <h4 className="label">Suggested Tags</h4>
        {inner}
      </div>
    ));
  };
  if (isNullOrUndefined(props.data.error) === false) {
    return wrap(<span className="deemph">Failed to load suggested tags - sorry</span>);
  }
  if (props.data.loading) {
    return wrap(<span className="deemph">Loading...</span>);
  }
  if (props.data.suggestTags.length === 0) {
    return wrap(<span className="deemph">No suggested tags for this beneficiary</span>);
  }
  return wrap((
    <span>
      {renderArray<string>(renderTag, props.data.suggestTags)}
    </span>
  ));
}

class RecordTagInputWithSuggestionsInner extends React.Component<IProps, any> {
  public render() {
    return (
      <div className="record-tag-input-w-suggestions">
        <RecordTagInput
          onChange={this.props.onChange}
          tags={this.props.tags}
          allowNewTags={this.props.allowNewTags}
        />
        {renderSuggested(this.props)}
      </div>
    );
  }
}

const getBeneficiary = (p: IProps) => p.beneficiary;

const RecordTagInputWithSuggestions = suggestTags<IProps>(getBeneficiary)(RecordTagInputWithSuggestionsInner);
export { RecordTagInputWithSuggestions };
