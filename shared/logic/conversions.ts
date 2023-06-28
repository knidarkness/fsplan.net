export enum DistanceUnit {
  Meters = "m",
  StatuteMiles = "SM"
}

enum ValueIndicator {
  GreaterThan = "P",
  LessThan = "M"
}

interface Distance {
  indicator?: ValueIndicator;
  value: number;
  unit: DistanceUnit;
  /** No Directional Visibility */
  ndv?: true;
}
export type Visibility = Distance & {
  /**
   * Never in North American METARs
   */
  min?: {
    /** Always in meters */
    value: number;
    direction: string;
  };
};

const statuteMilesToMeters = (distanceSM: number): number => {
  return distanceSM * 1609.34;
};

export function getVisibilityInMeters (visibility: Visibility) {
  let visibilityMeters;

  switch (visibility.unit) {
    case DistanceUnit.Meters:
      visibilityMeters = visibility.value;
      break;
    case DistanceUnit.StatuteMiles:
      visibilityMeters = statuteMilesToMeters(visibility.value);
  }

  return visibilityMeters;
}
