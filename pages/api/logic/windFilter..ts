import {Airport, AirportFilters} from "../interfaces";
import {isNotANumber} from "./utils";

export const filterByRunwayWind = (
  airport: Airport,
  filters: AirportFilters
): boolean => {
  if (
    isNotANumber(filters?.windConditions?.min) &&
    isNotANumber(filters?.windConditions?.max)
  ) {
    return true;
  }

  if (
    !airport.metar ||
    typeof airport.metar === "string" ||
    !airport?.metar?.wind?.speed
  ) {
    return false;
  }

  if (!isNotANumber(filters?.windConditions?.min) && airport.metar.wind.speed < (filters?.windConditions?.min as number)) {
    return false;
  }

  if (!isNotANumber(filters?.windConditions?.max) && airport.metar.wind.speed > (filters?.windConditions?.max as number)) {
    return false;
  }

  return true;
}
