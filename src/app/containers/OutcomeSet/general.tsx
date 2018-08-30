import * as React from 'react';
import {EditQuestionnaireName} from 'components/EditQuestionnaireName';
import {EditQuestionnaireDescription} from 'components/EditQuestionnaireDescription';
import {EditQuestionnaireInstructions} from 'components/EditQuestionnaireInstructions';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation} from 'apollo/modules/outcomeSets';
import {IQuestionMutation} from 'apollo/modules/questions';
import { Button, Icon } from 'semantic-ui-react';
import {Hint} from 'components/Hint';
const strings = require('./../../../strings.json');

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

interface IState {
  displayEditNameControl?: boolean;
  displayEditDescriptionControl?: boolean;
  editingInstructions?: boolean;
}

class GeneralInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.setEditNameState = this.setEditNameState.bind(this);
    this.setEditDescState = this.setEditDescState.bind(this);
    this.setEditInstructionsState = this.setEditInstructionsState.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);
  }

  private setEditNameState(displayed: boolean): () => void {
    return () => {
      this.setState({
        displayEditNameControl: displayed,
      });
    };
  }

  private setEditDescState(displayed: boolean): () => void {
    return () => {
      this.setState({
        displayEditDescriptionControl: displayed,
      });
    };
  }

  private setEditInstructionsState(displayed: boolean): () => void {
    return () => {
      this.setState({
        editingInstructions: displayed,
      });
    };
  }

  private renderEditButton(onClick: () => void): JSX.Element {
    return (
      <Button icon={true} basic={true} circular={true} size="mini" onClick={onClick}>
        <Icon name="pencil"/>
      </Button>
    );
  }

  public render() {
    const { data, match: {params} } = this.props;
    const { displayEditNameControl, displayEditDescriptionControl, editingInstructions } = this.state;
    const os = data.getOutcomeSet;
    return (
      <div>
        {displayEditNameControl ?
          <EditQuestionnaireName data={data} outcomeSetID={params.id} afterSubmit={this.setEditNameState(false)} />
          :
          <h1>{os.name}{this.renderEditButton(this.setEditNameState(true))}</h1>
        }
        {displayEditDescriptionControl ?
          <EditQuestionnaireDescription data={data} outcomeSetID={params.id} afterSubmit={this.setEditDescState(false)} />
          :
          <p>{os.description || 'No description'}{this.renderEditButton(this.setEditDescState(true))}</p>
        }
        <h3>Instructions <Hint text={strings.instructionsExplanation} /></h3>
        {editingInstructions ?
          <EditQuestionnaireInstructions data={data} outcomeSetID={params.id} afterSubmit={this.setEditInstructionsState(false)} />
          :
          <p className="instructions">{os.instructions || 'No instructions'}{this.renderEditButton(this.setEditInstructionsState(true))}</p>
        }
      </div>
    );
  }
}

export const General = getOutcomeSet<IProps>((props) => props.match.params.id)(GeneralInner);
