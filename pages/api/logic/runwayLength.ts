import { Airport, AirportFilters } from "../interfaces";

export const filterByRunwayLength = (
  airport: Airport,
  filters: AirportFilters
): boolean => {
  if (!filters.runwayLength) return true;
  if (
    filters.runwayLength?.min &&
    !airport.runways.some(
      (rw) =>
        filters.runwayLength?.min && rw.length_ft > filters.runwayLength.min
    )
  ) {
    return false;
  }
  if (
    filters.runwayLength?.max &&
    !airport.runways.some(
      (rw) =>
        filters.runwayLength?.max && rw.length_ft < filters.runwayLength.max
    )
  ) {
    return false;
  }
  return true;
};
