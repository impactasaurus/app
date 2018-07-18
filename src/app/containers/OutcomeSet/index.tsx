import * as React from 'react';
import { Helmet } from 'react-helmet';
import {EditQuestionnaireName} from 'components/EditQuestionnaireName';
import {EditQuestionnaireDescription} from 'components/EditQuestionnaireDescription';
import {EditQuestionnaireInstructions} from 'components/EditQuestionnaireInstructions';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import { Button, Icon, Grid, Loader } from 'semantic-ui-react';
import {CategoryList} from 'components/CategoryList';
import {QuestionList} from 'components/QuestionList';
import {Hint} from 'components/Hint';
const strings = require('./../../../strings.json');
import './style.less';

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  displayEditNameControl?: boolean;
  displayEditDescriptionControl?: boolean;
  editingInstructions?: boolean;
};

class OutcomeSetInner extends React.Component<IProps, IState> {
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
      <Button icon basic circular size="mini" onClick={onClick}>
        <Icon name="pencil"/>
      </Button>
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container columns={1} id="question-set">
          <Grid.Column>
            <Helmet>
              <title>Questionnaire</title>
            </Helmet>
            <div>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };
    const { data, params } = this.props;
    const { displayEditNameControl, displayEditDescriptionControl, editingInstructions } = this.state;
    if (data.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return wrapper(<div />);
    }
    return wrapper((
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
        <h3>Questions</h3>
        <QuestionList outcomeSetID={params.id} data={this.props.data}/>
        <h3>Question Categories <Hint text={strings.questionCategoryExplanation} /></h3>
        <CategoryList outcomeSetID={params.id} data={this.props.data}/>
      </div>
    ));
  }
}

const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(deleteQuestion<IProps>(OutcomeSetInner));
export { OutcomeSet }
