import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'redux/modules/outcomeSets';
const style = require('./style.css');

interface IProps extends IOutcomeMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  editError: string;
};

class OutcomeSetInner extends React.Component<IProps, IState> {

  private newName: React.HTMLAttributes<string>;
  private newDescription: React.HTMLAttributes<string>;

  constructor(props) {
    super(props);
    this.state = {
      editError: undefined,
    };
    this.renderEditControl = this.renderEditControl.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.setNewDescription = this.setNewDescription.bind(this);
    this.editQS = this.editQS.bind(this);
  }

  private setNewName(input) {
    this.newName = input;
  }

  private setNewDescription(input) {
    this.newDescription = input;
  }

  private editQS() {
    this.props.editQuestionSet(this.props.params.id, this.newName.value as string, this.newDescription.value as string)
    .then(() => {
      this.setState({
        editError: undefined,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        editError: e.message,
      });
    });
  }

  private renderEditControl(): JSX.Element {
    return (
      <div>
        <input type="text" placeholder="Name" ref={this.setNewName}/>
        <input type="text" placeholder="Description" ref={this.setNewDescription}/>
        <button onClick={this.editQS}>Edit</button>
        <p>{this.state.editError}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <div className={style.Home}>
        <p>name: {os.name}</p>
        <p>description: {os.description}</p>
        <p>number of questions: {os.questions.length}</p>
        {this.renderEditControl()}
      </div>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(editQuestionSet(OutcomeSetInner));
export { OutcomeSet }
