import * as React from 'react';
import {Input, Button, ButtonProps} from 'semantic-ui-react';

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
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
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

  private setName(_, data) {
    this.setState({
      ...this.state,
      name: data.value,
    });
  }

  private setDescription(_, data) {
    this.setState({
      ...this.state,
      description: data.value,
    });
  }

  public render() {
    const submitProps: ButtonProps = {};
    if (this.state.saving) {
      submitProps.loading = true;
      submitProps.disabled = true;
    }
    return (
      <div>
        <Input type="text" placeholder="Name" onChange={this.setName}/>
        <Input type="text" placeholder="Description" onChange={this.setDescription}/>
        <Button onClick={this.props.onCancel}>Cancel</Button>
        <Button {...submitProps} primary onClick={this.onSubmit}>Create</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

export {NewQuestionnaireForm};
