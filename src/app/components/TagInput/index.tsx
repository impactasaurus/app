import * as React from 'react';
import {Label, Icon, Input} from 'semantic-ui-react';
import * as TagsInput from 'react-tagsinput';
import './style.less';

interface IProps {
  onChange: (tags: string[]) => void;
  renderInput?: (props) => JSX.Element;
  addOnBlur?: boolean;
  addOnKeyboard?: boolean;
  tags: string[];
}

class TagInput extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  private onChange(tags: string[]): void {
    this.props.onChange(tags);
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
      <Input icon type="text" placeholder="Add tag" onChange={onChange} value={value} {...other}>
        <input />
        <Icon name="add" link />
      </Input>
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
    const input = this.props.renderInput || this.renderInput;
    const addOnBlur = this.props.addOnBlur !== false;
    const addKeys = this.props.addOnKeyboard === false ? [] : [13]; // enter
    return (
      <TagsInput
        className="tag-input"
        value={this.props.tags}
        onChange={this.onChange}
        renderTag={this.renderTag}
        renderInput={input}
        renderLayout={this.renderLayout}
        addOnBlur={addOnBlur}
        removeKeys={[]}
        addKeys={addKeys}
      />
    );
  }
}

export { TagInput };
