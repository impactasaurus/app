import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Menu } from 'semantic-ui-react';
import {SecondaryMenu} from 'components/SecondaryMenu';
import { General } from './general';
import { Questions } from './questions';
import { Categories } from './categories';
import {Error} from 'components/Error';
import { Switch, Route } from 'react-router-dom';
import './style.less';
import {IStore} from 'redux/IStore';
import {Hint} from 'components/Hint';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from '../../redux/modules/url';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from 'apollo/modules/catalogue';
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');

export enum Page {
  GENERAL,
  QUESTIONS,
  CATEGORIES,
}

interface IProps extends IURLConnector {
  data: ICatalogueQuestionnaire;
  match: {
    params: {
      id: string,
    },
    path: string,
    url: string,
  };
  page: Page;
}

@connect((state: IStore) => {
  let page = Page.GENERAL;
  if (state.router.location.pathname.endsWith('questions')) {
    page = Page.QUESTIONS;
  } else if (state.router.location.pathname.endsWith('categories')) {
    page = Page.CATEGORIES;
  }
  return {
    page,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class CatalogueQuestionnaireInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.innerPageSetter = this.innerPageSetter.bind(this);
  }

  private handleClick(url: string, search?: string) {
    return () => {
      this.props.setURL(url, search);
    };
  }

  private innerPageSetter(toSet: Page): () => void {
    return () => {
      let subPage: string;
      switch(toSet) {
        case Page.QUESTIONS: {
          subPage = 'questions';
          break;
        }
        case Page.CATEGORIES: {
          subPage = 'categories';
          break;
        }
        default: {
          subPage = '';
          break;
        }
      }
      this.handleClick(`/catalogue/${this.props.match.params.id}/${subPage}`)();
    };
  }

  public render() {
    const wrapper = (inner: JSX.Element, signpost?: string): JSX.Element => {
      const page = this.props.page;
      return (
        <div>
          <SecondaryMenu signpost={signpost}>
            <Menu.Item name="General" active={page === Page.GENERAL} onClick={this.innerPageSetter(Page.GENERAL)} />
            <Menu.Item name="Questions" active={page === Page.QUESTIONS} onClick={this.innerPageSetter(Page.QUESTIONS)} />
            <Menu.Item active={page === Page.CATEGORIES} onClick={this.innerPageSetter(Page.CATEGORIES)}>
              <Hint text={strings.questionCategoryExplanation} /> Categories
            </Menu.Item>
          </SecondaryMenu>
          <Grid container={true} columns={1} id="catalouge-questionnaire">
            <Grid.Column>
              <Helmet>
                <title>{signpost ? signpost : 'Questionnaire'}</title>
              </Helmet>
              <div>
                {inner}
              </div>
            </Grid.Column>
          </Grid>
        </div>
      );
    };
    const { data: {loading, getCatalogueQuestionnaire, error}} = this.props;
    if (error) {
      return wrapper((<Error text="Failed to load questionnaire" />), 'Unknown');
    }
    if (loading) {
      return wrapper((<Loader active={true} inline="centered" />), 'Loading...');
    }
    if (getCatalogueQuestionnaire === undefined) {
      return wrapper((<div />), 'Loading...');
    }
    const match = this.props.match.path;
    return wrapper((
      <Switch>
        <Route exact={true} path={`${match}/`} component={General} />
        <Route path={`${match}/questions`} component={Questions} />
        <Route path={`${match}/categories`} component={Categories} />
      </Switch>
    ), getCatalogueQuestionnaire.name);
  }
}

export const CatalogueQuestionnaire = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(CatalogueQuestionnaireInner);
