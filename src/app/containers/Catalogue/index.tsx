import * as React from 'react';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector, setURL} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import { bindActionCreators } from 'redux';
import {List} from 'semantic-ui-react';
import './style.less';
import {getCatalogueQuestionnaires, ICatalogueQuestionnaires} from 'apollo/modules/catalogue';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import {ImportQuestionnaireButton} from 'components/ImportQuestionnaireButton';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  data: ICatalogueQuestionnaires;
}

const renderQuestionnaire = (os: IOutcomeSet, onClick: () => void): JSX.Element => (
  <List.Item className="questionnaire" key={os.id}>
    <List.Content floated="right">
      <ImportQuestionnaireButton questionnaireID={os.id} text={false} options={{size: 'tiny'}}/>
    </List.Content>
    <List.Content onClick={onClick}>
      <List.Header as="a">{os.name}</List.Header>
      <List.Description as="a">{os.description}</List.Description>
    </List.Content>
  </List.Item>
);

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class CatalogueInner extends React.Component<IProps, any> {

  private navigateToQuestionnaire(id: string) {
    return () => this.props.setURL(`/catalogue/${id}`);
  }

  private renderQuestionnaire(q: IOutcomeSet) {
    return renderQuestionnaire(q, this.navigateToQuestionnaire(q.id).bind(this));
  }

  public render() {
    return (
      <List divided={true} relaxed={true} verticalAlign="middle" className="list">
        {renderArray(this.renderQuestionnaire.bind(this), this.props.data.getCatalogueQuestionnaires || [])}
      </List>
    );
  }
}

const CatalogueInnerWithSpinner = ApolloLoaderHoC('catalogue', (p: IProps) => p.data, CatalogueInner);
const CatalogueInnerWithWrapper = PageWrapperHoC('Catalogue', 'catalogue', CatalogueInnerWithSpinner);
export const Catalogue = getCatalogueQuestionnaires<IProps>(CatalogueInnerWithWrapper);
