import { Airport, Runway } from "../../pages/api/interfaces";
import { Box, Text } from "@chakra-ui/react";

function getCrossWind(
  rwyHeading?: number,
  windDirection?: number,
  windSpeed?: number
) {
  if ([rwyHeading, windSpeed, windDirection].includes(undefined)) {
    return `Wind unknown.`;
  }
  return `${Math.abs(
    Math.floor(
      Math.sin(
        (((rwyHeading as number) - (windDirection as number)) * Math.PI) / 180
      ) * (windSpeed as number)
    )
  )} kts crosswind`;
}

function getHeadWind(
  rwyHeading?: number,
  windDirection?: number,
  windSpeed?: number
) {
  if ([rwyHeading, windSpeed, windDirection].includes(undefined)) {
    return `Wind unknown.`;
  }
  const wind = Math.floor(
    Math.cos(
      (((rwyHeading as number) - (windDirection as number)) * Math.PI) / 180
    ) * (windSpeed as number)
  );
  return `${Math.abs(wind)} ${wind > 0 ? "headwind" : "tailwind"}`;
}

export function RunwayInfo({
  airport,
  runwayIdent,
}: {
  airport: Airport;
  runwayIdent: string;
}) {
  const runway: Runway | undefined = airport.runways.find(
    (rwy) => rwy.le_ident === runwayIdent
  );
  if (!runway) {
    return <></>;
  }
  if (airport.metar?.wind?.degrees === undefined) {
    return <Text>Can&apos;t compute winds in variable conditions</Text>;
  }
  return (
    <Box marginTop={2}>
      <Box>
        <b>{runway.le_ident}</b>{" "}
        {getCrossWind(
          runway.le_heading_degT,
          airport.metar?.wind?.degrees,
          airport.metar?.wind?.speed
        )}{" "}
        {getHeadWind(
          runway.le_heading_degT,
          airport.metar?.wind?.degrees,
          airport.metar?.wind?.speed
        )}
      </Box>
      <Box>
        <b>{runway.he_ident}</b>{" "}
        {getCrossWind(
          runway.he_heading_degT,
          airport.metar?.wind?.degrees,
          airport.metar?.wind?.speed
        )}{" "}
        {getHeadWind(
          runway.he_heading_degT,
          airport.metar?.wind?.degrees,
          airport.metar?.wind?.speed
        )}
      </Box>
    </Box>
  );
}
