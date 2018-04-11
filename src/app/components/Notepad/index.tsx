import * as React from 'react';
import {Icon, Form, Accordion, TextArea, TextAreaProps} from 'semantic-ui-react';
import './style.less';
import {isNullOrUndefined} from 'util';

interface IProps {
  notes: string | undefined | null;
  onChange: (notes: string) => void;
  placeholder?: string;
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

  public render() {
    let placeholder = this.props.placeholder || 'Record any additional information';
    placeholder = placeholder + '. Please ensure the notes do not contain personally identifiable information.';
    const notesNotNull: string | undefined = this.props.notes ? this.props.notes : undefined;
    return (
      <Accordion className="notepad">
        <Accordion.Title className="accordion" active={this.state.open} index={0} onClick={this.toggleOpen}>
          <Icon name="dropdown" />
          Notes
        </Accordion.Title>
        <Accordion.Content active={this.state.open}>
          <Form>
            <TextArea autoHeight placeholder={placeholder} rows={2} onChange={this.onChange} value={notesNotNull} />
          </Form>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export { Notepad };
