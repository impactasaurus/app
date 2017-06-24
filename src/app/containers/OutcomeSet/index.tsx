import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'redux/modules/outcomeSets';
const style = require('./style.css');

interface IProps {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

class OutcomeSetInner extends React.Component<IProps, {}> {

  constructor(props) {
    super(props);
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
      </div>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(OutcomeSetInner);
export { OutcomeSet }
