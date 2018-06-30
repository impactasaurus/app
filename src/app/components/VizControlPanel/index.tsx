import * as React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import './style.less';
import { bindActionCreators } from 'redux';
import {setPref, SetPrefFunc} from 'modules/pref';
import {IStore} from 'redux/IStore';
import {Aggregation, AggregationKey, Visualisation, VisualisationKey, getAggregation, getVisualisation} from 'models/pref';
import {isNullOrUndefined} from 'util';
const ReactGA = require('react-ga');
const { connect } = require('react-redux');

interface IProps {
  canCategoryAg: boolean;
  vis?: Visualisation;
  agg?: Aggregation;
  setPref?: SetPrefFunc;
  showVizOptions?: boolean; // defaults to true
  allowGraph?: boolean; // defaults to true
  controls?: JSX.Element; // additional, optional controls
  export?: () => void; // if set, will be called if the export button is pressed
}

@connect((state: IStore, ownProps: IProps) => {
  return {
    vis: getVisualisation(state.pref, ownProps.allowGraph !== false),
    agg: getAggregation(state.pref, ownProps.canCategoryAg),
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

  private reactGAVis(label: string) {
    ReactGA.event({
      category : 'visualisation',
      action : 'changed',
      label,
    });
  }
  private reactGAAgg(label: string) {
    ReactGA.event({
      category : 'aggregation',
      action : 'changed',
      label,
    });
  }
  private setAggPref(value: Aggregation): () => void {
    this.reactGAAgg(Aggregation[value]);
    return () => {
      this.props.setPref(AggregationKey, Aggregation[value]);
    };
  }

  private setVisPref(value: Visualisation): () => void {
    this.reactGAVis(Visualisation[value]);
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

  private getVisButtons(): JSX.Element[] {
    const buttons = [
      (<Button key="radar" active={this.props.vis === Visualisation.RADAR} onClick={this.setVisPref(Visualisation.RADAR)}>Radar</Button>),
      (<Button.Or key="vizOr"/>),
      (<Button key="table" active={this.props.vis === Visualisation.TABLE} onClick={this.setVisPref(Visualisation.TABLE)}>Table</Button>),
    ];
    if (this.props.allowGraph !== false) {
      buttons.push(
        (<Button.Or key="vizOr2" />),
        (<Button key="graph" active={this.props.vis === Visualisation.GRAPH} onClick={this.setVisPref(Visualisation.GRAPH)}>Graph</Button>),
      );
    }
    return buttons;
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
    if (this.props.showVizOptions !== false) {
      cpItems.push((
        <Button.Group key="vis">
          {this.getVisButtons()}
        </Button.Group>
      ));
    }
    if (!isNullOrUndefined(this.props.export)) {
      cpItems.push((<Popup trigger={<Button icon="download" onClick={this.props.export} />} content="Export data" />));
    }
    return (
      <div className="viz-cp">
        {cpItems}
        {this.props.controls}
      </div>
    );
  }
}

export { VizControlPanel }
