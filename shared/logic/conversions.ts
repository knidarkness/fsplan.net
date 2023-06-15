import { DistanceUnit, Visibility } from "metar-taf-parser";

const statuteMilesToMeters = (distanceSM: number): number => {
  return distanceSM * 1609.34;
};

export const getVisibilityInMeters = (visibility: Visibility) => {
  let visibilityMeters;

  switch (visibility.unit) {
    case DistanceUnit.Meters:
      visibilityMeters = visibility.value;
      break;
    case DistanceUnit.StatuteMiles:
      visibilityMeters = statuteMilesToMeters(visibility.value);
  }

  return visibilityMeters;
};
