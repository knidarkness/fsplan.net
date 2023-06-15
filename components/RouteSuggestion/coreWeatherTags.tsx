import { Badge, Box } from "@chakra-ui/react";
import { Airport } from "../../pages/api/interfaces";
import { getWindDirection } from "./utils";

export default function CoreWeatherTags({ airport }: { airport: Airport }) {
  return (
    <Box>
      {airport?.metar?.altimeter ? (
        <>
          <Badge>
            QNH:{" "}
            {`${airport?.metar?.altimeter?.value} 
            ${airport?.metar?.altimeter?.unit}`}
          </Badge>{" "}
        </>
      ) : (
        <></>
      )}

      {airport?.metar?.wind ? (
        <>
          <Badge>
            Wind: {getWindDirection(airport?.metar?.wind)}@
            {airport?.metar?.wind?.speed}
            {airport?.metar?.wind?.unit}
          </Badge>{" "}
        </>
      ) : (
        <></>
      )}
      {airport?.metar?.temperature ? (
        <>
          <Badge>Temperature ℃: {airport?.metar?.temperature}</Badge>{" "}
        </>
      ) : (
        <></>
      )}
      {airport?.metar?.dewPoint ? (
        <Badge>Dew point ℃: {airport?.metar?.dewPoint}</Badge>
      ) : (
        <></>
      )}
      {airport?.metar?.clouds
        .filter((l) => l.height !== undefined)
        .map((layer, id) => (
          <span key={`cloud-${airport.ident}-${id}`}>
            {" "}
            <Badge key={`${airport.ident}-layers-${id}`}>
              {layer.quantity} {layer.height}
            </Badge>
          </span>
        ))}
      {airport?.metar?.visibility?.value !== undefined ? (
        <span>
          {" "}
          <Badge>
            Visibility: {airport.metar?.visibility?.value || ""}{" "}
            {airport.metar?.visibility?.unit || ""}
          </Badge>
        </span>
      ) : (
        ""
      )}
    </Box>
  );
}
