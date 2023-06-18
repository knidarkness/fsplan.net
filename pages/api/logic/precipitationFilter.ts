import { Airport, AirportFilters } from "../interfaces";
import { Phenomenon } from "metar-taf-parser";

const RAIN_PHENOMENONS = [
  Phenomenon.RAIN,
  Phenomenon.DRIZZLE,
  Phenomenon.HAIL,
  Phenomenon.SMALL_HAIL,
];

const THUNDERSTORM_PHENOMENONS = [Phenomenon.THUNDERSTORM];

const FOG_PHENOMENONS = [Phenomenon.FOG, Phenomenon.MIST, Phenomenon.HAZE];

export const filterByPrecipitation = (
  airport: Airport,
  filters: AirportFilters
): boolean => {
  if (
    !(
      filters.requireRain ||
      filters.requirePrecipitation ||
      filters.requireThunderstorm ||
      filters.requireFog
    )
  ) {
    return true;
  }
  const phenomenons = airport.metar?.weatherConditions
    .map((c) => c.phenomenons)
    .flat();
  if (
    filters.requireRain &&
    !(phenomenons && RAIN_PHENOMENONS.some((p) => phenomenons.includes(p)))
  ) {
    return false;
  }
  if (
    filters.requireThunderstorm &&
    !(
      phenomenons &&
      THUNDERSTORM_PHENOMENONS.some((p) => phenomenons.includes(p))
    )
  ) {
    return false;
  }
  if (
    filters.requireFog &&
    !(phenomenons && FOG_PHENOMENONS.some((p) => phenomenons.includes(p)))
  ) {
    return false;
  }
  if (
    filters.requirePrecipitation &&
    !(
      phenomenons &&
      [...RAIN_PHENOMENONS, ...THUNDERSTORM_PHENOMENONS].some((p) =>
        phenomenons.includes(p)
      )
    )
  ) {
    return false;
  }
  return true;
};
