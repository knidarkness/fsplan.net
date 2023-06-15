import { Airport, AirportFilters } from "../interfaces";
import { getVisibilityInMeters } from "../../../shared/logic/conversions";
import { isNotANumber } from "./utils";

export const filterByVisibility = (
  airport: Airport,
  filters: AirportFilters
): boolean => {
  if (
    isNotANumber(filters.visibilityRange.min) &&
    isNotANumber(filters.visibilityRange.max)
  ) {
    return true;
  }

  if (
    !airport.metar ||
    typeof airport.metar === "string" ||
    !airport.metar.visibility
  ) {
    return false;
  }

  const visibility = getVisibilityInMeters(airport.metar.visibility);

  if (isNotANumber(filters.visibilityRange.max)) {
    return visibility >= filters.visibilityRange.min;
  } else if (isNotANumber(filters.visibilityRange.min)) {
    return visibility <= filters.visibilityRange.max;
  } else {
    return (
      visibility >= filters.visibilityRange.min &&
      visibility <= filters.visibilityRange.max
    );
  }
};
