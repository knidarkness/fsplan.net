// @ts-ignore
const { readFileSync, writeFileSync } = require("fs");
const { getDistance } = require("geolib");

interface Airport {
  continent: string;
  iso_country: string;
  iata_code: string;
  longitude_deg: number;
  keywords: string;
  ident: string;
  latitude_deg: number;
  elevation_ft: number;
  home_link: string;
  municipality: string;
  type: string;
  local_code: string;
  name: string;
  iso_region: string;
  id: string;
  gps_code: string;
  scheduled_service: string;
  wikipedia_link: string;
  runways: Runway[];
  nearbyAirports?: {
    ident: string;
    distance: number;
  }[];
}

interface Runway {
  airport_ident: string;
  airport_ref: string;
  closed: boolean;
  he_displaced_threshold_ft: number;
  he_elevation_ft: number;
  he_heading_degT: number;
  he_ident: string;
  he_latitude_deg: number;
  he_longitude_deg: number;
  id: string;
  le_displaced_threshold_ft: number;
  le_elevation_ft: number;
  le_heading_degT: number;
  le_ident: string;
  le_latitude_deg: number;
  le_longitude_deg: number;
  length_ft: number;
  lighted: boolean;
  surface: string;
  width_ft: number;
}

const csvRunwaysDataRaw = readFileSync("./static/runways.csv", {
  encoding: "utf-8",
});

const airportsDataRaw = readFileSync("./static/airports.csv", {
  encoding: "utf-8",
});

const airportRunwayData: Record<string, Runway[]> = {};

csvRunwaysDataRaw
  .split("\n")
  .map((runwayString: string): Runway => {
    const arr = runwayString.split(",");
    return {
      id: arr[0]?.replaceAll('"', ""),
      airport_ref: arr[1]?.replaceAll('"', ""),
      airport_ident: arr[2]?.replaceAll('"', ""),
      length_ft: parseInt(arr[3]?.replaceAll('"', "")) || -1,
      width_ft: parseInt(arr[4]?.replaceAll('"', "")) || -1,
      surface: arr[5]?.replaceAll('"', ""),
      lighted: arr[6]?.replaceAll('"', "") === "1",
      closed: arr[7]?.replaceAll('"', "") === "1",
      le_ident: arr[8]?.replaceAll('"', ""),
      le_latitude_deg: parseFloat(arr[9]?.replaceAll('"', "")) || -1,
      le_longitude_deg: parseFloat(arr[10]?.replaceAll('"', "")) || -1,
      le_elevation_ft: parseFloat(arr[11]?.replaceAll('"', "")) || -1,
      le_heading_degT: parseFloat(arr[12]?.replaceAll('"', "")) || -1,
      le_displaced_threshold_ft: parseInt(arr[13]?.replaceAll('"', "")) || -1,
      he_ident: arr[14]?.replaceAll('"', ""),
      he_latitude_deg: parseFloat(arr[15]?.replaceAll('"', "")) || -1,
      he_longitude_deg: parseFloat(arr[16]?.replaceAll('"', "")) || -1,
      he_elevation_ft: parseFloat(arr[17]?.replaceAll('"', "")) || -1,
      he_heading_degT: parseFloat(arr[18]?.replaceAll('"', "")) || -1,
      he_displaced_threshold_ft: parseInt(arr[19]?.replaceAll('"', "")) || -1,
    };
  })
  .forEach((runway: Runway) => {
    const existingRunways = airportRunwayData[runway.airport_ident];
    airportRunwayData[runway.airport_ident] = Array.isArray(existingRunways)
      ? [...existingRunways, runway]
      : [runway];
  });

// console.log(AirportRunwayData["LOWW"]);

const airportsData: Airport[] = airportsDataRaw
  .split("\n")
  .slice(1)
  .map((airportString: string): Airport | null => {
    const arr = airportString.split(",");
    const airport = {
      id: arr[0]?.replaceAll('"', ""),
      ident: arr[1]?.replaceAll('"', ""),
      type: arr[2]?.replaceAll('"', ""),
      name: arr[3]?.replaceAll('"', ""),
      latitude_deg: parseFloat(arr[4]?.replaceAll('"', "")),
      longitude_deg: parseFloat(arr[5]?.replaceAll('"', "")),
      elevation_ft: parseFloat(arr[6]?.replaceAll('"', "")) || -1,
      continent: arr[7]?.replaceAll('"', ""),
      iso_country: arr[8]?.replaceAll('"', ""),
      iso_region: arr[9]?.replaceAll('"', ""),
      municipality: arr[10]?.replaceAll('"', ""),
      scheduled_service: arr[11]?.replaceAll('"', ""),
      gps_code: arr[12]?.replaceAll('"', ""),
      iata_code: arr[13]?.replaceAll('"', ""),
      local_code: arr[14]?.replaceAll('"', ""),
      home_link: arr[15]?.replaceAll('"', ""),
      wikipedia_link: arr[16]?.replaceAll('"', ""),
      keywords: arr[17]?.replaceAll('"', ""),
      runways: airportRunwayData[arr[1]?.replaceAll('"', "")] || [],
    };
    if (!airport.latitude_deg || !airport.longitude_deg) {
      return null;
    }
    return airport;
  })
  .filter((airport: Airport) => !!airport);

const airportsMap: Record<string, Airport> = {};

let i = 0;
airportsData.forEach((airport) => {
  if (i % 100 === 0) {
    console.log(`Processing... ${i} at ${new Date().toISOString()}`);
  }
  i++;
  airport.nearbyAirports = airportsData
    .filter((otherAirport) => airport.iso_country === otherAirport.iso_country)
    .map((otherAirport) => {
      const distanceMeters = getDistance(
        {
          latitude: airport.latitude_deg,
          longitude: airport.longitude_deg,
        },
        {
          latitude: otherAirport.latitude_deg,
          longitude: otherAirport.longitude_deg,
        }
      );
      const distanceNM = Math.floor(distanceMeters / 1852);
      return {
        ident: otherAirport.ident,
        distance: distanceNM,
      };
    })
    .filter((airport) => airport.distance <= 40)
    .sort((a, b) => a.distance - b.distance)
    .slice(1, 20);
});
airportsData.forEach((item) => {
  airportsMap[item.ident] = item;
});

writeFileSync(
  "./static/airport-data-with-nearby-by-country.json",
  JSON.stringify(airportsMap, null, 2)
);
