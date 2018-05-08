import * as React from 'react';
import { Helmet } from 'react-helmet';
import {EditQuestionnaireName} from 'components/EditQuestionnaireName';
import {EditQuestionnaireDescription} from 'components/EditQuestionnaireDescription';
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
};

class OutcomeSetInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayEditNameControl = this.displayEditNameControl.bind(this);
    this.displayEditDescriptionControl = this.displayEditDescriptionControl.bind(this);
    this.renderEditNameButton = this.renderEditNameButton.bind(this);
    this.renderEditDescriptionButton = this.renderEditDescriptionButton.bind(this);
    this.hideEditNameControl = this.hideEditNameControl.bind(this);
    this.hideEditDescriptionControl = this.hideEditDescriptionControl.bind(this);
  }

  private displayEditNameControl() {
    this.setState({
      displayEditNameControl: true,
    });
  }

  private displayEditDescriptionControl() {
    this.setState({
      displayEditDescriptionControl: true,
    });
  }

  private hideEditNameControl() {
    this.setState({
      displayEditNameControl: false,
    });
  }

  private hideEditDescriptionControl() {
    this.setState({
      displayEditDescriptionControl: false,
    });
  }

  private renderEditNameButton(): JSX.Element {
    return (
      <Button icon basic circular size="mini" onClick={this.displayEditNameControl}>
        <Icon name="pencil"/>
      </Button>
    );
  }

  private renderEditDescriptionButton(): JSX.Element {
    return (
      <Button icon basic circular size="mini" onClick={this.displayEditDescriptionControl}>
        <Icon name="pencil"/>
      </Button>
    );
  }

  public render() {
    const { data, params } = this.props;
    const { displayEditNameControl, displayEditDescriptionControl } = this.state;
    if (data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <Grid container columns={1} id="question-set">
        <Grid.Column>
          <Helmet>
            <title>Question Sets</title>
          </Helmet>
          {displayEditNameControl ?
            <EditQuestionnaireName data={data} outcomeSetID={params.id} afterSubmit={this.hideEditNameControl} />
            :
            <h1>{os.name}{this.renderEditNameButton()}</h1>
          }
          {displayEditDescriptionControl ?
            <EditQuestionnaireDescription data={data} outcomeSetID={params.id} afterSubmit={this.hideEditDescriptionControl} />
            :
            <div>Description: {os.description || 'No description'}{this.renderEditDescriptionButton()}</div>
          }
          <h3>Questions</h3>
          <QuestionList outcomeSetID={params.id} data={this.props.data}/>
          <h3>Question Categories <Hint text={strings.questionCategoryExplanation} /></h3>
          <CategoryList outcomeSetID={params.id} data={this.props.data}/>
        </Grid.Column>
      </Grid>
    );
  }
}

const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(deleteQuestion<IProps>(OutcomeSetInner));
export { OutcomeSet }
