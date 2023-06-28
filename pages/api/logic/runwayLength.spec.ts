import { filterByRunwayLength } from './runwayLength';
import { Airport, AirportFilters } from "../interfaces";

describe('filterByRunwayLength', () => {
  let mockAirport: Airport;
  let mockFilters: AirportFilters;

  beforeEach(() => {
    mockAirport = {
      runways: [
        { length_ft: 3000 },
        { length_ft: 6000 },
        { length_ft: 9000 },
      ],
    } as Airport;
  });

  test('returns true when no runwayLength filter is provided', () => {
    mockFilters = {} as AirportFilters;
    const result = filterByRunwayLength(mockAirport, mockFilters);
    expect(result).toBe(true);
  });

  test('returns false when runwayLength min is not met', () => {
    mockFilters = { runwayLength: { min: 10000 } } as AirportFilters;
    const result = filterByRunwayLength(mockAirport, mockFilters);
    expect(result).toBe(false);
  });

  test('returns true when runwayLength min is met', () => {
    mockFilters = { runwayLength: { min: 3000 } } as AirportFilters;
    const result = filterByRunwayLength(mockAirport, mockFilters);
    expect(result).toBe(true);
  });

  test('returns false when runwayLength max is exceeded', () => {
    mockFilters = { runwayLength: { max: 2000 } } as AirportFilters;
    const result = filterByRunwayLength(mockAirport, mockFilters);
    expect(result).toBe(false);
  });

  test('returns true when runwayLength max is not exceeded', () => {
    mockFilters = { runwayLength: { max: 10000 } } as AirportFilters;
    const result = filterByRunwayLength(mockAirport, mockFilters);
    expect(result).toBe(true);
  });
});