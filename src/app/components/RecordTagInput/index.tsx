import * as React from 'react';
import {Search, Icon} from 'semantic-ui-react';
import {TagInput} from 'components/TagInput';
import './style.less';
import {ITagResult, getTags} from 'apollo/modules/tags';

interface IProps {
  onChange: (tags: string[]) => void;
  data?: ITagResult;
  allowNewTags?: boolean;
  tags: string[];
}

function getMatchingTags(systemTags: string[], selectedTags: string[], q: string) {
  return systemTags
    .filter((t) => selectedTags.indexOf(t) === -1) // don't show tags that have already been selected
    .filter((t) => t.toLowerCase().includes(q.toLowerCase()));
}

class RecordTagInputInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  private renderInput(props) {
    const {onChange, value, addTag, ...other} = props;
    const addTagWithVal = () => addTag(value);
    const handleResultSelect = (_, { result }) => {
      if (result.addValue === true) {
        return addTagWithVal();
      }
      addTag(result.title);
    };
    const results: any[] = getMatchingTags(this.props.data.getTags || [], this.props.tags, value)
      .map((t) => ({title: t}));
    let icon;
    if (this.props.allowNewTags !== false) {
      results.push({
        title: 'Create a new tag',
        description: 'Click here or the plus icon',
        addValue: true,
      });
      icon = (<Icon name="add" link onClick={addTagWithVal} />);
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
    return (
      <div className="record-tag-input">
        <TagInput
          onChange={this.props.onChange}
          renderInput={this.renderInput}
          addOnBlur={false}
          addOnKeyboard={false}
        />
      </div>
    );
  }
}

const RecordTagInput = getTags<IProps>(RecordTagInputInner);
export { RecordTagInput };
