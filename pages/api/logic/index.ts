import { getDistance } from "geolib";
import { Airport, AirportFilters } from "../interfaces";
import { getAirportsWithMETARs } from "./metar";
import { filterByVisibility } from "./visibilityFilter";
import { filterByCeiling } from "./ceilingFilter";
import { filterByRunwayLength } from "./runwayLength";
import { getAirportsWithTAFs } from "./taf";

import { readFileSync } from "fs";

const airports = JSON.parse(
  readFileSync("./static/airport-data-with-nearby-by-region.json", {
    encoding: "utf-8",
  })
) as unknown as Record<string, Airport>;

const findByDistance = (
  sourceAirport: string,
  targetDistances: {
    min: number;
    max: number;
  }
) => {
  const targetAirportData = airports[sourceAirport];
  if (!targetAirportData) {
    console.log(`no airport found for: ${sourceAirport}`);
    return [];
  }

  return Object.values(airports)
    .map((airport: Airport) => {
      const distance = getDistance(
        { latitude: airport.latitude_deg, longitude: airport.longitude_deg },
        {
          latitude: targetAirportData.latitude_deg,
          longitude: targetAirportData.longitude_deg,
        }
      );
      const distanceNM = Math.floor(distance / 1852);
      return {
        ...airport,
        meta: {
          ...(airport.meta || {}),
          distance: distanceNM,
        },
      };
    })
    .filter((data: any) => {
      return (
        data.meta.distance >= targetDistances.min &&
        data.meta.distance <= targetDistances.max
      );
    })
    .sort((a, b) => a.meta.distance - b.meta.distance);
};

const enhanceAirports = async (
  airports: Airport[],
  allowDerivedMetar: boolean
): Promise<Airport[]> => {
  const withMetars = await getAirportsWithMETARs(airports, allowDerivedMetar);
  return await getAirportsWithTAFs(withMetars, allowDerivedMetar);
};

export const filterAirports = async (airportFilters: AirportFilters) => {
  const nearby: Airport[] = findByDistance(
    airportFilters.departureAirport,
    airportFilters.distanceRange
  ) as unknown as Airport[];
  const airportsWithMetar = await enhanceAirports(
    nearby,
    !!airportFilters.allowDerivedMetar
  );
  return airportsWithMetar
    .filter((airport) => filterByCeiling(airport, airportFilters))
    .filter((airport) => filterByVisibility(airport, airportFilters))
    .filter((airport) => filterByRunwayLength(airport, airportFilters))
    .filter((airport) => !!airport.taf);
};
