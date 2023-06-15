import { IWind, Visibility } from "metar-taf-parser";

export function getVisibilityIndicator(vis: Visibility) {
  return vis.indicator || "";
}

export function getWindDirection(wind: IWind) {
  return wind?.degrees || "Variable";
}
