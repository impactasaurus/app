import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import { Grid, Loader, Menu } from 'semantic-ui-react';
import {SecondaryMenu} from 'components/SecondaryMenu';
import { General } from './general';
import { Questions } from './questions';
import { Categories } from './categories';
import { Switch, Route } from 'react-router-dom';
import './style.less';
import {IStore} from 'redux/IStore';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from '../../redux/modules/url';
const { connect } = require('react-redux');

export enum Page {
  GENERAL,
  QUESTIONS,
  CATEGORIES,
}

interface IProps extends IURLConnector {
  data: IOutcomeResult;
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
class OutcomeSetInner extends React.Component<IProps, any> {

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
      this.handleClick(`/questions/${this.props.match.params.id}/${subPage}`)();
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
            <Menu.Item name="Categories" active={page === Page.CATEGORIES} onClick={this.innerPageSetter(Page.CATEGORIES)} />
          </SecondaryMenu>
          <Grid container={true} columns={1} id="question-set">
            <Grid.Column>
              <Helmet>
                <title>Questionnaire</title>
              </Helmet>
              <div>
                {inner}
              </div>
            </Grid.Column>
          </Grid>
        </div>
      );
    };
    const { data: {loading, getOutcomeSet}} = this.props;
    if (loading) {
      return wrapper((<Loader active={true} inline="centered" />), 'Loading...');
    }
    if (getOutcomeSet === undefined) {
      return wrapper((<div />), 'Loading...');
    }
    const match = this.props.match.path;
    return wrapper((
      <Switch>
        <Route exact={true} path={`${match}/`} component={General} />
        <Route path={`${match}/questions`} component={Questions} />
        <Route path={`${match}/categories`} component={Categories} />
      </Switch>
    ), getOutcomeSet.name);
  }
}

export const OutcomeSet = getOutcomeSet<IProps>((props) => props.match.params.id)(OutcomeSetInner);
