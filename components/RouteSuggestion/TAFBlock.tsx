import {
  IAbstractWeatherContainer,
  ITAF,
  IValidity,
  IWeatherCondition,
  TAFTrend,
} from "metar-taf-parser";
import {
  AbsoluteCenter,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { getVisibilityIndicator, getWindDirection } from "./utils";

function Validity({ validity }: { validity: IValidity }) {
  return (
    <Box>
      <Box>
        <Text>
          Starting: {validity.startDay} at {validity.startHour}:
        </Text>
        <Text>
          Ending: {validity.endDay} at {validity.endHour}z.
        </Text>
      </Box>
    </Box>
  );
}

function TafValidity({
  trend: { validity, probability },
}: {
  trend: TAFTrend;
}) {
  return (
    <Box>
      <Heading as={"h6"} size={"xs"}>
        Validity
      </Heading>
      <Box>
        <Text>{probability ? `Probability: ${probability}%` : ""}</Text>
        <Text>
          Starting: {validity.startDay} at {validity.startHour}:
          {validity.startMinutes ? `:${validity.startMinutes}` : ""}
          z.
        </Text>
        {validity.endDay ? (
          <Text>
            Ending: {validity.endDay} at {validity.endHour}
            z.
          </Text>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
}

function WeatherConditions({
  weatherItem,
}: {
  weatherItem: IAbstractWeatherContainer;
}) {
  return (
    <>
      {weatherItem.visibility ? (
        <Text>
          <b>Visibility: </b>
          {`${getVisibilityIndicator(weatherItem.visibility)} ${
            weatherItem.visibility?.value
          } ${weatherItem.visibility?.unit}`}
        </Text>
      ) : (
        <></>
      )}
      {weatherItem.wind ? (
        <Text>
          <b>Wind: </b>
          {`${getWindDirection(weatherItem.wind)}@${weatherItem.wind?.speed} ${
            weatherItem.wind?.unit
          }.`}{" "}
          {weatherItem.wind?.gust ? `Gust: ${weatherItem.wind.gust}` : ""}
        </Text>
      ) : (
        <></>
      )}
      {weatherItem.clouds && weatherItem.clouds.length > 0 ? (
        <>
          <b>Clouds: </b>
          {weatherItem.clouds.map((clouds, id) => (
            <Text key={id}>
              {clouds.quantity} {clouds.height} {clouds.type}
            </Text>
          ))}
        </>
      ) : (
        <></>
      )}
      <Text>
        <b>Raw</b>:{" "}
        {(weatherItem as any).raw || (weatherItem as any).initialRaw}
      </Text>
    </>
  );
}

function WeatherPhenomenon({
  conditions,
}: {
  conditions: IWeatherCondition[];
}) {
  return (
    <>
      <b>Phenomenons</b>:{" "}
      {conditions.map((condition, index) => (
        <div key={index}>
          {condition.intensity}
          {condition.descriptive}
          {condition.phenomenons.join(",")}
        </div>
      ))}
    </>
  );
}

function Trends({ taf }: { taf: ITAF }) {
  return (
    <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
      {taf.trends.map((trend: TAFTrend, id) => (
        <Card
          key={`${taf.station}-${trend.validity.startHour}-${id}`}
          margin={2}
          width={"300px"}
        >
          <CardBody>
            <TafValidity trend={trend} />
            <WeatherPhenomenon conditions={trend.weatherConditions} />
            <WeatherConditions weatherItem={trend} />
          </CardBody>
        </Card>
      ))}
    </Box>
  );
}

function TAFBody(taf: ITAF) {
  return (
    <Box>
      <>
        {" "}
        <Box position="relative" padding="5">
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            <Heading size={"sm"} as={"h5"}>
              Validity
            </Heading>
          </AbsoluteCenter>
        </Box>
        <Validity validity={taf.validity} />
        <Box position="relative" padding="5">
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            <Heading size={"sm"} as={"h5"}>
              Conditions
            </Heading>
          </AbsoluteCenter>
        </Box>
        <WeatherConditions weatherItem={taf} />
        {taf.trends && taf.trends.length > 0 ? (
          <>
            <Box position="relative" padding="5">
              <Divider />
              <AbsoluteCenter bg="white" px="4">
                <Heading size={"sm"} as={"h5"}>
                  Trends{" "}
                </Heading>
              </AbsoluteCenter>
            </Box>
            <Trends taf={taf} />
          </>
        ) : (
          <></>
        )}
      </>{" "}
    </Box>
  );
}

export default function TAFBlock({ taf }: { taf?: ITAF }) {
  return (
    <Card className={"route-suggestion-card"}>
      <CardHeader style={{ paddingBottom: "5px" }}>
        <Heading as={"h4"} size={"md"}>
          TAF
        </Heading>
      </CardHeader>

      <CardBody>
        {!!taf ? (
          TAFBody(taf)
        ) : (
          <Heading as={"h4"} size={"sm"}>
            No TAF Available
          </Heading>
        )}
      </CardBody>
    </Card>
  );
}
