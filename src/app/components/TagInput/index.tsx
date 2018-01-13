import * as React from 'react';
import {Label, Icon, Input} from 'semantic-ui-react';
import * as TagsInput from 'react-tagsinput';
import './style.less';

interface IProps {
  onChange: (tags: string[]) => void;
}

interface IState {
  tags: string[];
}

class TagInput extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
    this.onChange = this.onChange.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  private onChange(tags: string[]): void {
    this.setState({
      tags,
    });
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
        {getTagDisplayValue(tag)}
        {!disabled &&
          <Icon name="close"/>
        }
      </Label>
    );
  }

  private renderInput(props) {
    const {onChange, value, ...other} = props;
    return (
      <Input type="text" placeholder="Add tag" onChange={onChange} value={value} {...other} />
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

  public render() {
    return (
      <TagsInput
        className="tag-input"
        value={this.state.tags}
        onChange={this.onChange}
        renderTag={this.renderTag}
        renderInput={this.renderInput}
        renderLayout={this.renderLayout}
        addOnBlur={true}
      />
    );
  }
}

export { TagInput };
