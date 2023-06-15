import cache from "../cache";
import { IMetar, parseMetar } from "metar-taf-parser";
import { Airport } from "../interfaces";

const getMissingMetarList = (
  airportsList: (Airport | { ident: string; metar: null | IMetar })[]
): string[] => {
  return airportsList
    .filter((airport) => !airport.metar)
    .map((airport) => airport.ident);
};

const getMetarFromCache = (icao: string) => {
  const cached = cache.get(icao);
  if (!cache || cached === "not found") {
    return undefined;
  }
  try {
    return parseMetar(cached as string);
  } catch (e) {
    return undefined;
  }
};

const getVatsimMetars = async (): Promise<Record<string, IMetar>> => {
  const vatsimMetarsString = await (
    await fetch("http://metar.vatsim.net/metar.php?id=all")
  ).text();

  const metarMap: Record<string, any> = {};
  vatsimMetarsString.split("\n").forEach((i) => {
    try {
      const parsedMetar = parseMetar(i);
      cache.set(parsedMetar.station, i);
      metarMap[parsedMetar.station] = parsedMetar;
    } catch (e) {}
  });
  return metarMap;
};

const removeEmptyMetars = (airports: Airport[]) => {
  return airports.filter((airport) => !!airport.metar);
};

const addZeroCloudHeight = (airport: Airport) => {
  if (!airport.metar) return airport;

  airport.metar.clouds = airport.metar.clouds
    ? airport.metar.clouds.map((cloudLayer) => {
        if (
          ["SCT", "BKN", "OVC"].includes(cloudLayer.quantity) &&
          cloudLayer.height === undefined
        ) {
          return {
            ...cloudLayer,
            height: 0,
          };
        }
        return cloudLayer;
      })
    : [];
  return airport;
};

function getCachedMetars(airports: Airport[]): {
  airports: Airport[];
  missingMetars: string[];
} {
  const airportsData = airports.map((airport) => ({
    ...airport,
    metar: getMetarFromCache(airport.ident),
  }));

  const missingMetars = getMissingMetarList(airportsData);
  return {
    airports: airportsData,
    missingMetars,
  };
}

async function fillWithVatsimMetars(airports: Airport[]): Promise<{
  airports: Airport[];
  metars: Record<string, IMetar>;
  missingMetars: string[];
}> {
  const vatsimMetars = await getVatsimMetars();
  console.log("received vatsim metars");
  const airportsWithVatsimMETARs = airports.map((airport) => ({
    ...airport,
    metar: vatsimMetars[airport.ident],
  }));

  const missingMetars = getMissingMetarList(airportsWithVatsimMETARs);

  return {
    airports: airportsWithVatsimMETARs,
    metars: vatsimMetars,
    missingMetars,
  };
}

function getNearestMetars(
  airports: Airport[],
  metars: Record<string, IMetar>,
  allowDerivedDerivedMetar: boolean
): Airport[] {
  return airports.map((airport) => {
    if (!allowDerivedDerivedMetar || airport.metar) {
      return airport;
    }

    const nearbyWeather = airport.nearbyAirports
      .map((airport) => ({
        ...airport,
        metar: metars[airport.ident],
      }))
      .filter((airport) => !!airport.metar);

    if (nearbyWeather.length === 0) {
      return airport;
    }

    airport = {
      ...airport,
      metar: nearbyWeather[0].metar,
      meta: {
        ...airport.meta,
        weatherDerivedFrom: nearbyWeather[0],
      },
    };

    return airport;
  });
}

export const getAirportsWithMETARs = async (
  airports: Airport[],
  allowDerivedDerivedMetar: boolean = false
) => {
  const {
    airports: airportsWithMetarFromCache,
    missingMetars: cacheMissingMetars,
  } = getCachedMetars(airports);

  if (cacheMissingMetars.length === 0) {
    console.log("100% cache hit");
    return removeEmptyMetars(airportsWithMetarFromCache);
  }
  console.log("missing metars for: ", cacheMissingMetars);

  const {
    airports: airportsWithVatsimMETARs,
    metars: vatsimMetars,
    missingMetars: missingVatsimMetars,
  } = await fillWithVatsimMetars(airportsWithMetarFromCache);
  if (missingVatsimMetars.length === 0) {
    console.log("metars only from vatsim");
    return removeEmptyMetars(airportsWithVatsimMETARs);
  }

  const enhancedAirports = getNearestMetars(
    airportsWithVatsimMETARs,
    vatsimMetars,
    allowDerivedDerivedMetar
  );

  return removeEmptyMetars(enhancedAirports).map((airport) => {
    return addZeroCloudHeight(airport);
  });
};
