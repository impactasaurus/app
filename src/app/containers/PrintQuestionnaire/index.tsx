import * as React from 'react';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {PageWrapperHoC} from 'components/PageWrapperHoC';

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
    return <div>{this.props.data.getOutcomeSet.name}</div>;
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
