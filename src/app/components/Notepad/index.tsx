import * as React from 'react';
import {Icon, Form, Accordion, TextArea, TextAreaProps} from 'semantic-ui-react';
import './style.less';
import {isNullOrUndefined} from 'util';

interface IProps {
  notes: string | undefined | null;
  onChange: (notes: string) => void;
  placeholder?: string;
  // defaults to true
  collapsible?: boolean;
}

interface IState {
  open: boolean;
}

class Notepad extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      open: props.notes !== undefined && props.notes !== null && props.notes.length > 0,
    };
    this.onChange = this.onChange.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.renderTextArea = this.renderTextArea.bind(this);
  }

  public componentWillUpdate(nextProps: IProps) {
    if (isNullOrUndefined(this.props.notes) && !isNullOrUndefined(nextProps.notes)) {
      this.setState({
        open: true,
      });
    }
  }

  private onChange(_: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps): void {
    if (typeof data.value === 'string') {
      this.props.onChange(data.value);
    }
  }

  private toggleOpen() {
    this.setState({
      open: !this.state.open,
    });
  }

  public renderTextArea(): JSX.Element {
    let placeholder = this.props.placeholder || 'Record any additional information';
    placeholder = placeholder + '. Please ensure the notes do not contain personally identifiable information.';
    const notesNotNull: string | undefined = this.props.notes ? this.props.notes : undefined;
    return (
      <Form>
        <TextArea autoHeight placeholder={placeholder} rows={2} onChange={this.onChange} value={notesNotNull} />
      </Form>
    );
  }

  public render() {
    if (this.props.collapsible === false) {
      return (
        <div className="notepad">
          {this.renderTextArea()}
        </div>
      );
    }
    return (
      <Accordion className="notepad">
        <Accordion.Title className="accordion" active={this.state.open} index={0} onClick={this.toggleOpen}>
          <Icon name="dropdown" />
          Notes
        </Accordion.Title>
        <Accordion.Content active={this.state.open}>
          {this.renderTextArea()}
        </Accordion.Content>
      </Accordion>
    );
  }
}

export { Notepad };
