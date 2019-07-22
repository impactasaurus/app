import * as React from 'react';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import {ILikertScale} from 'models/question';
import {sharedLabels} from 'helpers/likert';
import {List} from 'containers/PrintQuestionnaire/list';
import {PrintTable} from 'containers/PrintQuestionnaire/table';
import {getQuestions} from 'helpers/questionnaire';

interface IProps  {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

class PrintQuestionnaireInner extends React.Component<IProps, any> {
  public render() {
    let intro = <div />;
    if (this.props.data.getOutcomeSet.instructions && this.props.data.getOutcomeSet.instructions.length > 0) {
      intro = (
        <div>
          <h3>
            {this.props.data.getOutcomeSet.instructions}
          </h3>
          <hr style={{marginTop: '3em', marginBottom: '3em'}} />
        </div>
      );
    }
    const qq = getQuestions(this.props.data.getOutcomeSet) as ILikertScale[];
    const main = sharedLabels(qq) ?
      <PrintTable questions={qq}/> :
      <List questions={qq} />;
    return (
      <div>
        {intro}
        {main}
      </div>
    );
  }
}

const InnerWithSpinner = ApolloLoaderHoC('questionnaire', (p: IProps) => p.data, PrintQuestionnaireInner);
const InnerWithPageWrapper = PageWrapperHoC<IProps>((p: IProps): string => {
  if (p.data && p.data.getOutcomeSet && typeof p.data.getOutcomeSet.name === 'string') {
    return p.data.getOutcomeSet.name;
  }
  return '';
}, 'questionnaire-print', InnerWithSpinner);
const InnerWithData = getOutcomeSet<IProps>((props) => props.match.params.id)(InnerWithPageWrapper);

const PrintQuestionnaire = InnerWithData;
export { PrintQuestionnaire };
