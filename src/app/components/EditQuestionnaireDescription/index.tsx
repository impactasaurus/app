import * as React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { editQuestionSet, IOutcomeMutation } from 'apollo/modules/outcomeSets';
import { IOutcomeResult } from '../../apollo/modules/outcomeSets';
import './style.less';

interface IProps extends IOutcomeMutation {
  data?: IOutcomeResult;
  outcomeSetID: string;
  afterSubmit: ()=>void;
}

interface IState {
  isBeingSubmitted: boolean;
  error: string;
  description: string;
}

class EditQuestionnaireDescriptionInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      isBeingSubmitted: false,
      error: '',
      description: this.props.data.getOutcomeSet.description,
    };
    this.submitNewDescription = this.submitNewDescription.bind(this);
    this.onNewDescriptionInputKeyPress = this.onNewDescriptionInputKeyPress.bind(this);
    this.onDescriptionInputChange = this.onDescriptionInputChange.bind(this);
  }

  private submitNewDescription() {
    this.setState({
      ...this.state,
      isBeingSubmitted: true,
    });

    this.props.editQuestionSet(
      this.props.outcomeSetID,
      this.props.data.getOutcomeSet.name,
      this.state.description,
    )
      .then(() => {
        this.setState({
          ...this.state,
          error: undefined,
          isBeingSubmitted: false,
        });

        this.props.afterSubmit();
      })
      .catch((e: Error)=> {
        this.setState({
          ...this.state,
          error: e.message,
          isBeingSubmitted: false,
        });
      });
  }

  private onNewDescriptionInputKeyPress(e) {
    if (e.charCode === 13) {
      this.submitNewDescription();
    }
  }

  private moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  private onDescriptionInputChange(_, { value }: { value: string }) {
    this.setState({
      ...this.state,
      description: value,
    });
  }

  public render() {
    return (
      <div className="edit-control questionnaire description">
        <Input
          type="text"
          placeholder="Description"
          onChange={this.onDescriptionInputChange}
          onKeyPress={this.onNewDescriptionInputKeyPress}
          defaultValue={this.state.description}
          onFocus={this.moveCaretAtEnd}
          autoFocus
        />
        <Button onClick={this.props.afterSubmit}>Cancel</Button>
        <Button primary onClick={this.submitNewDescription} loading={this.state.isBeingSubmitted}>Save</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

const EditQuestionnaireDescription = editQuestionSet<IProps>(EditQuestionnaireDescriptionInner);

export { EditQuestionnaireDescription }
