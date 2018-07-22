import * as React from 'react';
import {ButtonProps, Form} from 'semantic-ui-react';
import './style.less';

export interface INewQuestionnaire {
  name: string;
  description: string;
}

interface IProps {
  onCancel: () => void;
  submit: (INewQuestionnaire) => Promise<any>;
}

interface IState extends INewQuestionnaire {
  error?: string;
  saving: boolean;
}

class NewQuestionnaireForm extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      saving: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  private onSubmit() {
    this.setState({
      ...this.state,
      saving: true,
      error: undefined,
    });
    this.props.submit(this.state)
      .then(() => {
        this.setState({
          ...this.state,
          saving: false,
        });
      })
      .catch((e: Error) => {
        this.setState({
          ...this.state,
          saving: false,
          error: e.message,
        });
      });
  }

  private handleChange(_, { name, value }) {
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  public render() {
    const submitProps: ButtonProps = {};
    if (this.state.saving) {
      submitProps.loading = true;
      submitProps.disabled = true;
    }
    return (
      <Form onSubmit={this.onSubmit} className="new-questionnaire-form">
        <Form.Group>
          <Form.Input name="name" type="text" placeholder="Name" onChange={this.handleChange} />
          <Form.Input name="description" type="text" placeholder="Description" onChange={this.handleChange} />
          <Form.Button onClick={this.props.onCancel}>Cancel</Form.Button>
          <Form.Button type="submit" primary {...submitProps}>Create</Form.Button>
        </Form.Group>
        <p>{this.state.error}</p>
      </Form>
    );
  }
}

export {NewQuestionnaireForm};
