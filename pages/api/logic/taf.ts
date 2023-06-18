import { ITAF, parseTAF } from "metar-taf-parser";
import { Airport } from "../interfaces";
import cache from "../cache";

const TAF_DOWNLOAD_URL = process.env.TAF_DOWNLOAD_URL || "";

const setNearestTAFs = (
  airport: Airport,
  allowDerivedMetar: boolean = false
): Airport => {
  if (!allowDerivedMetar || airport.taf) {
    return airport;
  }

  const nearbyWeather = airport.nearbyAirports
    .map((airport) => ({
      ...airport,
      taf: cache.get(`TAF-${airport.ident}`) as ITAF,
    }))
    .filter((airport) => !!airport.taf);

  if (nearbyWeather.length === 0) {
    return airport;
  }

  return {
    ...airport,
    taf: nearbyWeather[0].taf,
    meta: {
      ...airport.meta,
      weatherDerivedFrom: nearbyWeather[0],
    },
  };
};

export const getAirportsWithTAFs = async (
  airports: Airport[],
  allowDerivedMetar: boolean = false
): Promise<Airport[]> => {
  const tafsSet: boolean = !!cache.get("TAFSFlag");
  if (!tafsSet) {
    const tafsResponse = await fetch(TAF_DOWNLOAD_URL);
    const TAFsrows = (await tafsResponse.text()).split("\n").slice(6);
    TAFsrows.forEach((row) => {
      const tafLine = row.split(",")[0];
      let taf;
      try {
        taf = parseTAF(tafLine);
      } catch (e) {}
      if (!taf) return;
      cache.set(`TAF-${taf.station}`, taf);
    });
  }
  return airports
    .map((airport: Airport) => ({
      ...airport,
      taf: cache.get(`TAF-${airport.ident}`) as ITAF,
    }))
    .map((airport: Airport) => setNearestTAFs(airport, allowDerivedMetar));
};
