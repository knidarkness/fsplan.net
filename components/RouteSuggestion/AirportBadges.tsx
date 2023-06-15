import { Badge } from "@chakra-ui/react";
import { IMetar } from "metar-taf-parser";
import { getVisibilityInMeters } from "../../shared/logic/conversions";
import { Airport } from "../../pages/api/interfaces";

const metersInStatuteMile = 1609;

function getFlightRulesBadge(metar: IMetar) {
  if (!metar.visibility || !metar.clouds) {
    return <></>;
  }

  const visibility = getVisibilityInMeters(metar.visibility);
  const lowestCeiling = metar.clouds.filter((item) =>
    ["BKN", "OVC"].includes(item.quantity)
  )[0]?.height;

  if (visibility === undefined && lowestCeiling === undefined) {
    return <></>;
  }

  if (
    (lowestCeiling !== undefined && lowestCeiling < 500) ||
    visibility < metersInStatuteMile
  ) {
    return <Badge colorScheme={"cyan"}>LIFR</Badge>;
  }
  if (
    (lowestCeiling !== undefined && lowestCeiling < 1000) ||
    visibility < 3 * metersInStatuteMile
  ) {
    return <Badge colorScheme={"red"}>IFR</Badge>;
  }
  if (
    (lowestCeiling !== undefined && lowestCeiling < 3000) ||
    visibility < 5 * metersInStatuteMile
  ) {
    return <Badge colorScheme={"blue"}>MVFR</Badge>;
  }
  return <Badge colorScheme={"green"}>VFR</Badge>;
}

function derivedWeatherBadge(airport: Airport) {
  return (
    <Badge variant="outline">
      weather: {airport.meta?.weatherDerivedFrom?.ident} (
      {airport.meta?.weatherDerivedFrom?.distance} nm)
    </Badge>
  );
}

export function AirportBadges({ airport }: { airport: Airport }) {
  return (
    <>
      {" "}
      {airport?.metar && getFlightRulesBadge(airport?.metar)}{" "}
      {airport?.meta?.weatherDerivedFrom && derivedWeatherBadge(airport)}
    </>
  );
}
