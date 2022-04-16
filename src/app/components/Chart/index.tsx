import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js";
import {
  ColorSchemeGetter,
  getColorScheme,
  SeriesType,
} from "theme/chartStyle";
import { loadBrandChartColorScheme, shouldLoadBranding } from "theme/branding";

let count = 0;

interface IStyleOptions {
  fillAlpha?: number;
  seriesType?: SeriesType;
}

interface ILayoutOptions {
  height?: string; // css format expected
}

interface IProps {
  config: ChartConfiguration;
  style?: IStyleOptions;
  layout?: ILayoutOptions;
}

const applyStyling = (
  config: ChartConfiguration,
  colorScheme: ColorSchemeGetter,
  style?: IStyleOptions
): ChartConfiguration => {
  const out = { ...config };
  if (!out.options.plugins) {
    out.options.plugins = {};
  }
  out.options.plugins.colorschemes = {
    scheme: colorScheme(
      config.data.datasets.length,
      style.seriesType || SeriesType.INDEPENDENT
    ),
    fillAlpha: style.fillAlpha || 1,
  };
  return out;
};

const drawChart = (
  canvasID: string,
  config: ChartConfiguration,
  colorScheme: ColorSchemeGetter,
  style?: IStyleOptions
) => {
  const canvasElement = (
    document.getElementById(canvasID) as HTMLCanvasElement
  ).getContext("2d");
  if (canvasElement === null) {
    throw new Error("The canvas element specified does not exist!");
  }
  return new Chart(canvasElement, applyStyling(config, colorScheme, style));
};

const C = (p: IProps): JSX.Element => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeGetter>(
    () => getColorScheme
  );
  const chart = useRef<Chart | undefined>();
  const canvasID = useRef(`chart-${count++}`);

  useEffect(() => {
    if (shouldLoadBranding()) {
      loadBrandChartColorScheme()
        .then((fn) => {
          setColorScheme(() => fn);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    if (chart.current) {
      chart.current.destroy();
    }
    chart.current = drawChart(
      canvasID.current,
      p.config,
      colorScheme,
      p.style || {}
    );
  }, [p.config, p.style, colorScheme, canvasID]);

  return (
    <div
      className="chart"
      style={{ height: p?.layout?.height, position: "relative" }}
    >
      <canvas id={canvasID.current} />
    </div>
  );
};

export { C as Chart };
