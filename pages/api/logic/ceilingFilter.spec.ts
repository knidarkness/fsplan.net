import { filterByCeiling } from "./ceilingFilter";
import { Airport, AirportFilters } from "../interfaces";

describe("filterByCeiling", () => {
  test("returns true when neither min nor max are defined", () => {
    const airport = {
      metar: {
        clouds: [{ quantity: "BKN", height: 3000 }]
      }
    } as Airport;
    const filters = {
      ceilingRange: { min: NaN, max: NaN }
    } as AirportFilters;
    const result = filterByCeiling(airport, filters);
    expect(result).toEqual(true);
  });

  test("returns false when metar is undefined, a string or missing clouds data", () => {
    const filters = {
      ceilingRange: { min: 1000, max: 5000 }
    } as AirportFilters;
    const airport1 = {
      metar: null
    } as unknown as Airport;
    const airport2 = {
      metar: "SKC"
    } as unknown as Airport;
    const airport3 = {
      metar: { clouds: null }
    } as unknown as Airport;

    expect(filterByCeiling(airport1, filters)).toEqual(false);
    expect(filterByCeiling(airport2, filters)).toEqual(false);
    expect(filterByCeiling(airport3, filters)).toEqual(false);
  });

  test("returns false when no BKN or OVC clouds present", () => {
    const filters = {
      ceilingRange: { min: 1000, max: 5000 }
    } as AirportFilters;
    const airport = {
      metar: {
        clouds: [{ quantity: "FEW", height: 2000 }]
      }
    } as Airport;
    const result = filterByCeiling(airport, filters);
    expect(result).toEqual(false);
  });

  test("returns true when lowestCeiling is within the range", () => {
    const filters = {
      ceilingRange: { min: undefined, max: 5000 }
    } as unknown as AirportFilters;
    const airport = {
      metar: {
        clouds: [
          { quantity: "BKN", height: 3000 },
          { quantity: "OVC", height: 6000 }
        ]
      }
    } as Airport;

    const result = filterByCeiling(airport, filters);

    expect(result).toEqual(true);
  });
});