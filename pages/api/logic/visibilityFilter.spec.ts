import { filterByVisibility } from './visibilityFilter';  // Replace './your-file' with the actual path.
import { Airport, AirportFilters } from '../interfaces';
import { DistanceUnit, Visibility } from "../../../shared/logic/conversions"; // Replace './your-types-file' with the actual path of the types definition.

describe('filterByVisibility', () => {
  it('should return true if both min and max visibility range are not numbers', () => {
    const airport: Airport = {
      // fill up with mock data
    } as Airport;
    const filters: AirportFilters = {
      visibilityRange: {
        min: NaN,
        max: NaN,
      }
    } as AirportFilters;
    expect(filterByVisibility(airport, filters)).toBe(true);
  });

  it('should return false if metar is not defined or visibility is not present', () => {
    const airport: Airport = {
      // metar field should be missing
    } as Airport;
    const filters: AirportFilters = {
      visibilityRange: {
        min: 1,
        max: 1000,
      }
    } as AirportFilters;
    expect(filterByVisibility(airport, filters)).toBe(false);
  });

  it('should return correct value based on visibility range in meters', () => {
    const visibility: Visibility = {
      unit: DistanceUnit.Meters,
      value: 500
    }
    const airport: Airport = {
      metar: {
        visibility,
      }
    } as unknown as Airport;
    const filters: AirportFilters = {
      visibilityRange: {
        min: 100,
        max: 1000,
      }
    } as AirportFilters;

    expect(filterByVisibility(airport, filters)).toBe(true);

    filters.visibilityRange.min = 1000;
    filters.visibilityRange.max = 2000;

    expect(filterByVisibility(airport, filters)).toBe(false);
  });

  it('should return correct value based on visibility range in statute miles', () => {
    const visibility: Visibility = {
      unit: DistanceUnit.StatuteMiles,
      value: 3
    }
    const airport: Airport = {
      metar: {
        visibility,
      }
    } as unknown as Airport;
    const filters: AirportFilters = {
      visibilityRange: {
        min: 100,
        max: 1000,
      }
    } as AirportFilters;

    expect(filterByVisibility(airport, filters)).toBe(false);

    // 3 sm = ~4800m
    filters.visibilityRange.min = 4700;
    filters.visibilityRange.max = 4900;

    expect(filterByVisibility(airport, filters)).toBe(true);
  });
});