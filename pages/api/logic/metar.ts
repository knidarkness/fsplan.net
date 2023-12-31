import cache from "../cache";
import { IMetar, parseMetar } from "metar-taf-parser";
import { Airport } from "../interfaces";

const METAR_DOWNLOAD_URL = process.env.METAR_DOWNLOAD_URL || "";

const getMissingMetarList = (
  airportsList: (Airport | { ident: string; metar: null | IMetar })[]
): string[] => {
  return airportsList
    .filter((airport) => !airport.metar)
    .map((airport) => airport.ident);
};

const getMetarFromCache = (icao: string) => {
  const cached: string | undefined = cache.get(icao);
  if (!cached || cached === "not found") {
    return undefined;
  }
  try {
    return parseMetar(cached);
  } catch (e) {
    return undefined;
  }
};

const getOnlineMetars = async (): Promise<Record<string, IMetar>> => {
  const onlineMetarsString = await (await fetch(METAR_DOWNLOAD_URL)).text();

  const metarMap: Record<string, any> = {};
  onlineMetarsString.split("\n").forEach((i) => {
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
  const onlineMetars = await getOnlineMetars();
  // console.log("received online metars");
  const airportsWithVatsimMETARs = airports.map((airport) => ({
    ...airport,
    metar: onlineMetars[airport.ident],
  }));

  const missingMetars = getMissingMetarList(airportsWithVatsimMETARs);

  return {
    airports: airportsWithVatsimMETARs,
    metars: onlineMetars,
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
    // console.log("100% cache hit");
    return removeEmptyMetars(airportsWithMetarFromCache);
  }
  // console.log("missing metars for: ", cacheMissingMetars);

  const {
    airports: airportsWithVatsimMETARs,
    metars: vatsimMetars,
    missingMetars: missingVatsimMetars,
  } = await fillWithVatsimMetars(airportsWithMetarFromCache);
  if (missingVatsimMetars.length === 0) {
    // console.log("metars only from online");
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
