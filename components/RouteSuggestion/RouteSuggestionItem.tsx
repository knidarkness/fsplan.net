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
      className={'route-suggestion-item'}
    >
      <AccordionButton paddingLeft={"0px"}>
        <Box flex={"1"} textAlign={"left"}>
          <Text fontSize={"16pt"}>
            {airport.ident} ({airport.name})
            <AirportBadges airport={airport} />
            <Link
              className={"navigraphChartsLinkBtn"}
              target={"_blank"}
              href={`https://charts.navigraph.com/airport/${airport.ident}?chartCategory=ARR&section=Information`}
            >
              Charts
            </Link>
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <CoreWeatherTags airport={airport} />
      <div className={"routeSuggestionItemSummary"}>
        <Link
          color={"#D90368"}
          fontWeight={"bold"}
          href={`http://www.simbrief.com/system/dispatch.php?orig=${from}&dest=${airport.ident}&type=A320`}
          target={"_blank"}
        >
          Generate SimBrief flight plan: {from} {airport.ident} (
          {airport?.meta?.distance} nm)
        </Link>
      </div>
      <AccordionPanel className={'route-suggestion-item-accordion'} pb={4}>
        <MetarBlock airport={airport} />
        {!!airport?.taf ? <TAFBlock taf={airport?.taf} /> : <></>}
        {!!airport.runways && airport.runways.length > 0 ? (
          <RunwaysBlock airport={airport} />
        ) : (
          <></>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
