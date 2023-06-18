import { Airport, AirportFilters } from "../interfaces";
import { isNotANumber } from "./utils";

export const filterByCeiling = (
  airport: Airport,
  filters: AirportFilters
): boolean => {
  if (
    isNotANumber(filters.ceilingRange.min) &&
    isNotANumber(filters.ceilingRange.max)
  ) {
    return true;
  }

  if (
    !airport.metar ||
    typeof airport.metar === "string" ||
    !airport.metar.clouds
  ) {
    return false;
  }

  if (!airport.metar.clouds) {
    return false;
  }

  const lowestCeiling = airport.metar.clouds.filter((item) =>
    ["BKN", "OVC"].includes(item.quantity)
  )[0]?.height;

  if (!lowestCeiling) return false;

  if (
    !isNotANumber(filters.ceilingRange.min) &&
    lowestCeiling < filters.ceilingRange.min
  ) {
    return false;
  }

  return !(
    !isNotANumber(filters.ceilingRange.max) &&
    lowestCeiling > filters.ceilingRange.max
  );
};
