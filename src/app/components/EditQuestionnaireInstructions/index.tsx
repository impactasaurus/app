import * as React from 'react';
import { TextArea, Button, Form } from 'semantic-ui-react';
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
  instructions: string;
}

class EditQuestionnaireInstructionsInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      isBeingSubmitted: false,
      error: '',
      instructions: this.props.data.getOutcomeSet.instructions,
    };
    this.submitNewInstructions = this.submitNewInstructions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  private submitNewInstructions() {
    this.setState({
      ...this.state,
      isBeingSubmitted: true,
    });

    this.props.editQuestionSet(
      this.props.outcomeSetID,
      this.props.data.getOutcomeSet.name,
      this.props.data.getOutcomeSet.description,
      this.state.instructions,
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

  private moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  private onChange(_, { value }: { value: string }) {
    this.setState({
      ...this.state,
      instructions: value,
    });
  }

  public render() {
    return (
      <div className="edit-control questionnaire instructions">
        <Form>
          <TextArea
            placeholder="Instructions"
            onChange={this.onChange}
            defaultValue={this.state.instructions}
            onFocus={this.moveCaretAtEnd}
            autoFocus
            autoHeight
            rows={3}
          />
        </Form>
        <div>
          <Button onClick={this.props.afterSubmit}>Cancel</Button>
          <Button primary onClick={this.submitNewInstructions} loading={this.state.isBeingSubmitted}>Save</Button>
          <p>{this.state.error}</p>
        </div>
      </div>
    );
  }
}

const EditQuestionnaireInstructions = editQuestionSet<IProps>(EditQuestionnaireInstructionsInner);

export { EditQuestionnaireInstructions }
