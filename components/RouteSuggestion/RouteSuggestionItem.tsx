import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  Text,
} from "@chakra-ui/react";
import CoreWeatherTags from "./coreWeatherTags";
import { AirportBadges } from "./AirportBadges";
import { Airport } from "../../pages/api/interfaces";
import TAFBlock from "./TAFBlock";
import RunwaysBlock from "./RunwaysBlock";
import MetarBlock from "./MetarBlock";

export default function RouteSuggestionItem({
  airport,
  from,
}: {
  from: string;
  airport: Airport;
}) {
  return (
    <AccordionItem
      key={airport.ident}
      border={"1px"}
      boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
      borderColor={"#808080"}
      m={"15px"}
      padding={"10px"}
      borderRadius={"5px"}
    >
      <AccordionButton paddingLeft={"0px"}>
        <Box flex={"1"} textAlign={"left"}>
          <Text fontSize={"16pt"}>
            {airport.ident} ({airport.name})
            <AirportBadges airport={airport} />
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <CoreWeatherTags airport={airport} />
      <Text>
        <Link
          color={"#D90368"}
          fontWeight={"bold"}
          href={`http://www.simbrief.com/system/dispatch.php?orig=${from}&dest=${airport.ident}&type=A320`}
          target={"_blank"}
        >
          Generate SimBrief flight plan: {from} {airport.ident} (
          {airport?.meta?.distance} nm)
        </Link>
      </Text>
      <AccordionPanel pb={4}>
        <div style={{ display: "flex" }}>
          <MetarBlock airport={airport} />
          {!!airport?.taf ? <TAFBlock taf={airport?.taf} /> : <></>}
          {!!airport.runways && airport.runways.length > 0 ? (
            <RunwaysBlock airport={airport} />
          ) : (
            <></>
          )}
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
}
