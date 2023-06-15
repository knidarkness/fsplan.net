import { Airport } from "../../pages/api/interfaces";
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

export default function MetarBlock({ airport }: { airport: Airport }) {
  return (
    <div>
      <Card style={{ margin: "5px", height: "calc(100% - 10px)" }}>
        <CardHeader style={{ paddingBottom: "5px" }}>
          <Heading as={"h4"} size={"md"}>
            METAR
          </Heading>
        </CardHeader>
        <CardBody>
          {!!airport?.metar?.altimeter ? (
            <Text>
              <b>QNH</b>: {airport?.metar?.altimeter?.value}{" "}
              {airport?.metar?.altimeter?.unit}
            </Text>
          ) : (
            <></>
          )}
          {!!airport?.metar?.wind ? (
            <Text>
              <b>Wind</b>: from {airport?.metar?.wind?.degrees} at{" "}
              {airport?.metar?.wind?.speed} {airport?.metar?.wind?.unit}
            </Text>
          ) : (
            <></>
          )}
          {!!airport?.metar?.visibility ? (
            <Text>
              <b>Visibility</b>: {airport?.metar?.visibility?.value}
              {airport?.metar?.visibility?.unit}
            </Text>
          ) : (
            <></>
          )}
          {!!airport?.metar?.temperature ? (
            <Text>
              <b>Temperature</b>: {airport?.metar?.temperature} C
            </Text>
          ) : (
            <></>
          )}
          {!!airport?.metar?.dewPoint ? (
            <Text>
              <b>Dew point</b>: {airport?.metar?.dewPoint} C
            </Text>
          ) : (
            <></>
          )}
          <br />
          <Text fontSize="sm">{airport?.metar?.message}</Text>
        </CardBody>
      </Card>
    </div>
  );
}
