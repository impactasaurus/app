import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation} from 'apollo/modules/outcomeSets';
import {IQuestionMutation} from 'apollo/modules/questions';
import { Grid, Loader, Menu } from 'semantic-ui-react';
import {SecondaryMenu} from 'components/SecondaryMenu';
import { General } from './general';
import { Questions } from './questions';
import { Categories } from './categories';
import { Switch, Route } from 'react-router-dom';
import './style.less';

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
    path: string,
    url: string,
  };
}

class OutcomeSetInner extends React.Component<IProps, any> {
  public render() {
    const wrapper = (inner: JSX.Element, signpost?: string): JSX.Element => {
      return (
        <div>
          <SecondaryMenu signpost={signpost}>
            <Menu.Item name="General" />
            <Menu.Item name="Questions" />
            <Menu.Item name="Categories" />
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
