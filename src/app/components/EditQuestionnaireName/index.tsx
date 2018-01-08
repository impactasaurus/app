import * as React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';
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
  name: string;
}

class EditQuestionnaireNameInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      isBeingSubmitted: false,
      error: '',
      name: this.props.data.getOutcomeSet.name,
    };
    this.submitNewName = this.submitNewName.bind(this);
    this.onNewNameInputKeyPress = this.onNewNameInputKeyPress.bind(this);
    this.onNameInputChange = this.onNameInputChange.bind(this);
  }

  private submitNewName() {
    this.setState({
      ...this.state,
      isBeingSubmitted: true,
    });

    this.props.editQuestionSet(
      this.props.outcomeSetID,
      this.state.name,
      this.props.data.getOutcomeSet.description,
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

  private onNewNameInputKeyPress(e) {
    if (e.charCode === 13) {
      this.submitNewName();
    }
  }

  private moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  private onNameInputChange(_, { value }: { value: string }) {
    this.setState({
      ...this.state,
      name: value,
    });
  }

  public render() {
    return (
      <div className="edit-control">
        <Input
          type="text"
          placeholder="Name"
          size="huge"
          onChange={this.onNameInputChange}
          onKeyPress={this.onNewNameInputKeyPress}
          value={this.state.name}
          onFocus={this.moveCaretAtEnd}
          autoFocus
        />
        <Button onClick={this.submitNewName} size="huge" icon labelPosition="right" loading={this.state.isBeingSubmitted}>
          Edit name
          <Icon name="pencil"/>
        </Button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

const EditQuestionnaireName = editQuestionSet<IProps>(EditQuestionnaireNameInner);

export { EditQuestionnaireName }
