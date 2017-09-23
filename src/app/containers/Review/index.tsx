import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
import {VizControlPanel} from 'components/VizControlPanel';
const { connect } = require('react-redux');
import {IStore} from 'redux/IStore';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import './style.less';

interface IProps {
  params: {
      id: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  data?: IMeetingResult;
  isCategoryAgPossible?: boolean;
};

function isCategoryAggregationAvailable(meetings: IMeeting[]): boolean {
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return false;
  }
  const meetingsWithCategories = meetings.filter((m) => {
    return m.outcomeSet.categories.length > 0;
  });
  return meetingsWithCategories.length > 0;
}

@connect((state: IStore, ownProps: IProps) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps.data.getMeetings);
  return {
    vis: getVisualisation(state.pref),
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
  };
}, undefined)
class ReviewInner extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  private renderVis(p: IProps): JSX.Element {
    if (p.vis === Visualisation.RADAR) {
      return (<div>RADAR</div>);
    }
    return (<div>TABLE</div>);
  }

  private renderInner(p: IProps): JSX.Element {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <div>
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} />
        {this.renderVis(p)}
      </div>
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    return (
      <Grid container columns={1}>
        <Grid.Column>
          <div id="review">
            <Helmet>
              <title>{this.props.params.id + ' Review'}</title>
            </Helmet>
            <h1>{this.props.params.id}</h1>
            {this.renderInner(this.props)}
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

const Review = getMeetings<IProps>((p) => p.params.id)(ReviewInner);
export { Review }
