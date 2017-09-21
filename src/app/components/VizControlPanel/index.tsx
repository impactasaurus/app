import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './style.less';
const { connect } = require('react-redux');
import { bindActionCreators } from 'redux';
import {setPref} from 'modules/pref';
import {IStore} from 'redux/IStore';
import {Aggregation, AggregationKey, Visualisation, VisualisationKey, getAggregation, getVisualisation} from 'models/pref';

interface IProps {
  canCategoryAg: boolean;
  vis?: Visualisation;
  agg?: Aggregation;
  setPref?: (key: string, value: string) => void;
};

@connect((state: IStore) => {
  return {
    vis: getVisualisation(state.pref),
    agg: getAggregation(state.pref),
  };
}, (dispatch) => ({
  setPref: bindActionCreators(setPref, dispatch),
}))
class VizControlPanel extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
    this.setAggPref = this.setAggPref.bind(this);
    this.setVisPref = this.setVisPref.bind(this);
    this.isAggActive = this.isAggActive.bind(this);
  }

  private setAggPref(value: Aggregation): () => void {
    return () => {
      this.props.setPref(AggregationKey, Aggregation[value]);
    };
  }

  private setVisPref(value: Visualisation): () => void {
    return () => {
      this.props.setPref(VisualisationKey, Visualisation[value]);
    };
  }

  private isAggActive(agg: Aggregation): boolean {
    if (agg === Aggregation.CATEGORY && this.props.canCategoryAg === false) {
      return false;
    }
    return this.props.agg === agg;
  }

  public render() {
    const cpItems: JSX.Element[] = [];
    cpItems.push((
      <Button.Group key="agg">
        <Button active={this.isAggActive(Aggregation.QUESTION)} onClick={this.setAggPref(Aggregation.QUESTION)}>Questions</Button>
        <Button.Or />
        <Button disabled={!this.props.canCategoryAg} active={this.isAggActive(Aggregation.CATEGORY)} onClick={this.setAggPref(Aggregation.CATEGORY)}>Categories</Button>
      </Button.Group>
    ));
    cpItems.push((
      <Button.Group key="vis">
        <Button active={this.props.vis === Visualisation.RADAR} onClick={this.setVisPref(Visualisation.RADAR)}>Radar</Button>
        <Button.Or />
        <Button active={this.props.vis === Visualisation.TABLE} onClick={this.setVisPref(Visualisation.TABLE)}>Table</Button>
      </Button.Group>
    ));
    return (
      <div className="viz-cp">
        {cpItems}
      </div>
    );
  }
}

export { VizControlPanel }
