import * as React from "react";
import { Button } from "semantic-ui-react";
import "./style.less";
import { bindActionCreators } from "redux";
import { setPref, SetPrefFunc } from "redux/modules/pref";
import { IStore } from "redux/IStore";
import {
  Aggregation,
  AggregationKey,
  Visualisation,
  VisualisationKey,
  getAggregation,
  getVisualisation,
} from "models/pref";
import { isNullOrUndefined } from "util";
import ReactGA from "react-ga4";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { TooltipButton } from "components/TooltipButton";

export const pageRegex =
  /(\/beneficiary\/[^/]*\/journey|\/beneficiary\/[^/]*$|\/beneficiary\/[^/]*\/$|\/report\/service\/|\/report\/delta\/)/;

interface IProps {
  canCategoryAg: boolean;
  vis?: Visualisation;
  agg?: Aggregation;
  setPref?: SetPrefFunc;
  visualisations: Visualisation[];
  controls?: JSX.Element; // additional, optional controls
  export?: () => void; // if set, will be called if the export button is pressed
  allowCanvasSnapshot?: boolean; // default = false
}

const VizControlPanelInner = (p: IProps) => {
  const { t } = useTranslation();

  const reactGAVis = (label: string) => {
    ReactGA.event({
      category: "visualisation",
      action: "changed",
      label,
    });
  };

  const reactGAAgg = (label: string) => {
    ReactGA.event({
      category: "aggregation",
      action: "changed",
      label,
    });
  };

  const setAggPref = (value: Aggregation): (() => void) => {
    return () => {
      reactGAAgg(Aggregation[value]);
      p.setPref(AggregationKey, Aggregation[value]);
    };
  };

  const setVisPref = (value: Visualisation): (() => void) => {
    return () => {
      reactGAVis(Visualisation[value]);
      p.setPref(VisualisationKey, Visualisation[value]);
    };
  };

  const isAggActive = (agg: Aggregation): boolean => {
    if (agg === Aggregation.CATEGORY && p.canCategoryAg === false) {
      return false;
    }
    return p.agg === agg;
  };

  const getVisButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const addButton = (button: JSX.Element) => {
      if (buttons.length > 0) {
        buttons.push(
          <Button.Or key={"vizOr" + buttons.length} text={t<string>("or")} />
        );
      }
      buttons.push(button);
    };
    p.visualisations.forEach((v) => {
      switch (v) {
        case Visualisation.GRAPH:
          addButton(
            <Button
              key="graph"
              active={p.vis === Visualisation.GRAPH}
              onClick={setVisPref(Visualisation.GRAPH)}
            >
              {t("Graph")}
            </Button>
          );
          break;
        case Visualisation.RADAR:
          addButton(
            <Button
              key="radar"
              active={p.vis === Visualisation.RADAR}
              onClick={setVisPref(Visualisation.RADAR)}
            >
              {t("Radar")}
            </Button>
          );
          break;
        case Visualisation.TABLE:
          addButton(
            <Button
              key="table"
              active={p.vis === Visualisation.TABLE}
              onClick={setVisPref(Visualisation.TABLE)}
            >
              {t("Table")}
            </Button>
          );
          break;
        case Visualisation.BAR:
          addButton(
            <Button
              key="bar"
              active={p.vis === Visualisation.BAR}
              onClick={setVisPref(Visualisation.BAR)}
            >
              {t("Bar")}
            </Button>
          );
          break;
        default:
          throw new Error("not valid visualisation");
      }
    });
    return buttons;
  };

  const canvasSnapshot = () => {
    const cs = document.getElementsByTagName("canvas");
    if (cs.length !== 1) {
      throw new Error(
        "A single canvas was not found when trying to export image"
      );
    }
    const link = document.createElement("a");
    link.download = "impactasaurus-graph.png";
    link.href = cs[0].toDataURL();
    link.click();
  };

  const renderExportControls = (): JSX.Element => {
    const cpItems: JSX.Element[] = [];
    if (!isNullOrUndefined(p.export)) {
      cpItems.push(
        <TooltipButton
          key="excel"
          buttonProps={{
            icon: "download",
            onClick: p.export,
          }}
          tooltipContent={t("Export data")}
        />
      );
    }
    if (p.allowCanvasSnapshot === true) {
      cpItems.push(
        <TooltipButton
          key="image"
          buttonProps={{ icon: "image outline", onClick: canvasSnapshot }}
          tooltipContent={t("Download image")}
        />
      );
    }
    if (cpItems.length === 0) {
      return undefined;
    }
    return <Button.Group key="export">{cpItems}</Button.Group>;
  };

  const cpItems: JSX.Element[] = [];
  cpItems.push(
    <Button.Group key="agg">
      <Button
        key="agg-q"
        active={isAggActive(Aggregation.QUESTION)}
        onClick={setAggPref(Aggregation.QUESTION)}
      >
        {t("Questions")}
      </Button>
      <Button.Or key="agg-or" text={t<string>("or")} />
      <Button
        key="agg-cat"
        disabled={!p.canCategoryAg}
        active={isAggActive(Aggregation.CATEGORY)}
        onClick={setAggPref(Aggregation.CATEGORY)}
      >
        {t("Categories")}
      </Button>
    </Button.Group>
  );
  if (p.visualisations.length > 0) {
    cpItems.push(<Button.Group key="vis">{getVisButtons()}</Button.Group>);
  }
  const exportControls = renderExportControls();
  if (!isNullOrUndefined(exportControls)) {
    cpItems.push(exportControls);
  }
  return (
    <div className="viz-cp">
      {cpItems}
      {p.controls}
    </div>
  );
};

const stateToProps = (state: IStore, ownProps: IProps) => {
  return {
    vis: getVisualisation(state.pref, ownProps.visualisations),
    agg: getAggregation(state.pref, ownProps.canCategoryAg),
  };
};

const dispatchToProps = (dispatch) => ({
  setPref: bindActionCreators(setPref, dispatch),
});

const VizControlPanel = connect(
  stateToProps,
  dispatchToProps
)(VizControlPanelInner);
export { VizControlPanel };
