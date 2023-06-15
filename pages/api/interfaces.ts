import { IMetar, ITAF } from "metar-taf-parser";

export interface RouteRequestBody {
  airportFilters: AirportFilters;
}

export interface Airport {
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
  nearbyAirports: NearbyAirport[];

  meta?: {
    distance?: number;
    tafDerivedFrom?: {
      ident: string;
      distance: number;
    };
    weatherDerivedFrom?: {
      ident: string;
      distance: number;
    };
  };

  metar?: IMetar;
  taf?: ITAF;
}

export interface NearbyAirport {
  ident: string;
  distance: number;
}

export interface Runway {
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

export interface AirportFilters {
  departureAirport: string;
  distanceRange: { min: number; max: number };
  visibilityRange: { min: number; max: number };
  ceilingRange: { min: number; max: number };
  runwayLength?: { min?: number; max?: number };
  windConditions?: { min?: number; max?: number };
  allowDerivedMetar?: boolean;
}

export interface MetarResponse {
  data: {
    elevation: { feet: number; meters: number };
    raw_text: string;
    flight_category: string;
    dewpoint: { celsius: number; fahrenheit: number };
    visibility: {
      meters_float: number;
      miles_float: number;
      meters: string;
      miles: string;
    };
    barometer: { mb: number; hpa: number; kpa: number; hg: number };
    clouds: {
      feet: number;
      code: string;
      base_feet_agl: number;
      base_meters_agl: number;
      text: string;
      meters: number;
    }[];
    observed: string;
    station: {
      name: string;
      geometry: { coordinates: number[]; type: string };
      location: string;
      type: string;
    };
    temperature: { celsius: number; fahrenheit: number };
    humidity: { percent: number };
    icao: string;
    conditions?: { code: string; prefix: string; text: string }[];
    wind: {
      speed_mph: number;
      speed_kph: number;
      speed_mps: number;
      speed_kts: number;
      degrees: number;
    };
  }[];
  results: number;
}
