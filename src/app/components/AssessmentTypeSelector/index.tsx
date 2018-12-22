import * as React from 'react';
import {AssessmentType, defaultRemoteMeetingLimit} from 'models/assessment';
const ReactGA = require('react-ga');
import './style.less';
import {Item, MultiChoice} from '../MultiChoice';

interface IProps  {
  typeSelector: (selected: AssessmentType) => void;
}

class AssessmentTypeSelector extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.typeClickFn = this.typeClickFn.bind(this);
  }

  private typeClickFn(t: AssessmentType): () => void {
    return () => {
      ReactGA.event({
        category: 'assessment',
        action: 'typeSelected',
        label: AssessmentType[t],
      });
      this.props.typeSelector(t);
    };
  }

  public render() {

    const items: Item[] = [{
      title: 'Live',
      subtitle: 'Complete together',
      description: 'Complete the questionnaire together',
      onClick: this.typeClickFn(AssessmentType.live),
    }, {
      title: 'Remote',
      subtitle: 'Send a link',
      description: `Generates a link that you can send to the beneficiary to complete on their own. The link will be valid for ${defaultRemoteMeetingLimit} days`,
      onClick: this.typeClickFn(AssessmentType.remote),
    }, {
      title: 'Data Entry',
      subtitle: 'Enter historic data',
      description: `Enter data gathered historically into the system. For example, if you completed the questionnaire on paper with the beneficiary`,
      onClick: this.typeClickFn(AssessmentType.historic),
    }];

    return (
      <MultiChoice items={items}/>
    );
  }
}

export { AssessmentTypeSelector };
