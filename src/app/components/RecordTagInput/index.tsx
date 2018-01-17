import * as React from 'react';
import {Search, Icon} from 'semantic-ui-react';
import {TagInput} from 'components/TagInput';
import './style.less';
import {ITagResult, getTags} from 'apollo/modules/tags';

interface IProps {
  onChange: (tags: string[]) => void;
  data?: ITagResult;
}

interface IState {
  tags: string[];
}

class RecordTagInputInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
    this.renderInput = this.renderInput.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  private onChange(tags: string[]) {
    this.props.onChange(tags);
    this.setState({tags});
  }

  private renderInput(props) {
    const {onChange, value, addTag, ...other} = props;
    const handleResultSelect = (_, { result }) => addTag(result.title);
    const addTagWithVal = () => addTag(value);
    const results = (this.props.data.getTags || [])
      .filter((t) => this.state.tags.indexOf(t) === -1)
      .filter((t) => t.toLowerCase().includes(value.toLowerCase()))
      .map((t) => ({title: t}));

    return (
      <Search
        loading={this.props.data.loading}
        onResultSelect={handleResultSelect}
        onSearchChange={onChange}
        results={results}
        open={value.length > 0}
        value={value}
        icon={(<Icon name="add" link onClick={addTagWithVal} />)}
        noResultsMessage={'No matching tags found'}
        noResultsDescription={'Press enter to add a new tag'}
        {...other}
      />
    );
  }

  public render() {
    return (
      <div className="record-tag-input">
        <TagInput
          onChange={this.onChange}
          renderInput={this.renderInput}
          addOnBlur={false}
      />
      </div>
    );
  }
}

const RecordTagInput = getTags<IProps>(RecordTagInputInner);
export { RecordTagInput };
