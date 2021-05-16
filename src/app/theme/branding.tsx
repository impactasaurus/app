import cssVars from "css-vars-ponyfill";
import { SeriesType } from "./chartStyle";
import * as defaultBranding from "./default.branding";

const subdomain = () => window.location.hostname.split(".")[0];

export function shouldLoadBranding(): boolean {
  return subdomain() !== "app";
}

export function setupBrandColors() {
  cssVars({});

  if (shouldLoadBranding()) {
    import(
      /* webpackChunkName: "colors-[request]" */ `./../../branding/${subdomain()}/${subdomain()}.branding`
    )
      .then((branding) => {
        branding.use();
      })
      .catch(() => {
        console.log(`no branding for subdomain '${subdomain()}'`);
        defaultBranding.use();
      });
  } else {
    defaultBranding.use();
  }
}

export function loadBrandLogo(): Promise<React.ComponentClass> {
  return import(
    /* webpackChunkName: "logo-[request]" */ `./../../branding/${subdomain()}/${subdomain()}.tsx`
  ).then((m) => m.default);
}

export function loadBrandChartColorScheme(): Promise<
  (noSeries: number, seriesType: SeriesType) => string | string[]
> {
  return import(
    /* webpackChunkName: "chart-[request]" */ `./../../branding/${subdomain()}/chart.ts`
  ).then((m) => m.default);
}
