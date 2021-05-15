import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Menu} from 'semantic-ui-react';
import {SecondaryMenu} from 'components/SecondaryMenu';
import { General } from './general';
import { Questions } from './questions';
import { Categories } from './categories';
import {Error} from 'components/Error';
import { Switch, Route } from 'react-router-dom';
import {IStore} from 'redux/IStore';
import {Hint} from 'components/Hint';
import {IURLConnector, UrlConnector} from '../../redux/modules/url';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from 'apollo/modules/catalogue';
import {ImportQuestionnaireButton} from 'components/ImportQuestionnaireButton';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './style.less';

export enum Page {
  GENERAL,
  QUESTIONS,
  CATEGORIES,
}

interface IProps extends IURLConnector {
  data?: ICatalogueQuestionnaire;
  match?: {
    params: {
      id: string,
    },
    path: string,
    url: string,
  };
  page?: Page;
}

const CatalogueQuestionnaireInner = (p: IProps) => {

  const {t} = useTranslation();
  const { data: {loading, getCatalogueQuestionnaire, error}} = p;

  const handleClick = (url: string, search?: string) => {
    return () => {
      p.setURL(url, search);
    };
  };

  const innerPageSetter = (toSet: Page): () => void => {
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
      handleClick(`/catalogue/${p.match.params.id}/${subPage}`)();
    };
  };

  const wrapper = (inner: JSX.Element, signpost?: string): JSX.Element => {
    const page = p.page;
    return (
      <div>
        <SecondaryMenu signpost={signpost}>
          <Menu.Item active={page === Page.GENERAL} onClick={innerPageSetter(Page.GENERAL)}>
            {t("General")}
          </Menu.Item>
          <Menu.Item active={page === Page.QUESTIONS} onClick={innerPageSetter(Page.QUESTIONS)}>
            {t("Questions")}
          </Menu.Item>
          <Menu.Item active={page === Page.CATEGORIES} onClick={innerPageSetter(Page.CATEGORIES)}>
            <Hint text={t("Group related questions into categories. This allows aggregation of multiple questions into a single value.")} />
            {t("Categories")}
          </Menu.Item>
        </SecondaryMenu>
        <Grid container={true} columns={1} id="catalouge-questionnaire">
          <Grid.Column>
            <Helmet>
              <title>{signpost ? signpost : t('Questionnaire')}</title>
            </Helmet>
            <div>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  if (error) {
    return wrapper((<Error text={t("Failed to load questionnaire")} />), t('Unknown'));
  }
  if (loading) {
    return wrapper((<Loader active={true} inline="centered" />), t('Loading...'));
  }
  if (getCatalogueQuestionnaire === undefined) {
    return wrapper((<div />), t('Loading...'));
  }

  const match = p.match.path;
  return wrapper((
    <div>
      <ImportQuestionnaireButton questionnaireID={p.match.params.id} text={true}/>
      <Switch>
        <Route exact={true} path={`${match}/`} component={General} />
        <Route path={`${match}/questions`} component={Questions} />
        <Route path={`${match}/categories`} component={Categories} />
      </Switch>
    </div>
  ), getCatalogueQuestionnaire.outcomeset.name);
}

const extractPageFromStore = (state: IStore) => {
  let page = Page.GENERAL;
  if (state.router.location.pathname.endsWith('questions')) {
    page = Page.QUESTIONS;
  } else if (state.router.location.pathname.endsWith('categories')) {
    page = Page.CATEGORIES;
  }
  return {
    page,
  };
}

const CatalogueQuestionnaireConnected = connect(extractPageFromStore, UrlConnector)(CatalogueQuestionnaireInner);
export const CatalogueQuestionnaire = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(CatalogueQuestionnaireConnected);
