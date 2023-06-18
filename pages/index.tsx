import { useSelector } from "react-redux";
import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useFlags } from "flagsmith/react";


import { Box, Center, Flex, Text } from "@chakra-ui/react";

import { AppState } from "../store/store";

import { AirportSelectionForm } from "../components/AirportSelectionForm";
import RouteSuggestionsList from "../components/RouteSuggestion/RouteSuggestionsList";
import OnlyForSimModal from "../components/OnlyForSimModal";
import FeedbackForm from "../components/Feedback";

const useGetPossibleDestinations = () => {
  const [destinations, setDestinations] = useState({ airports: [], from: "" });
  const [loading, setLoading] = useState(false);
  const airportFilters = useSelector((state: AppState) => state.airportFilters);

  async function getDestinations() {
    setLoading(true);
    const result = await fetch("/api/weather", {
      method: "POST",
      body: JSON.stringify({
        airportFilters: airportFilters
      })
    });
    const resp = await result.json();
    setDestinations(resp);
    setLoading(false);
  }

  return { loading, destinations, getDestinations };
};

const Home: NextPage = () => {
  const { loading, destinations, getDestinations } =
    useGetPossibleDestinations();

  const LeafletMapComponent = dynamic(
    () => import("../components/RouteSuggestion/_RouteSuggestionsMap"), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  );

  const flags = useFlags(["enable_wind_filter"]);

  return (
    <>
      <OnlyForSimModal />
      <Head>
        <title>Flight planning | Sergey Dubovyk</title>
      </Head>
      <Flex h={"100vh"}>
        <Box w="350px" bg={"#1B004A"} position={"relative"} overflow={"auto"}>
          <Center w={"95%"} margin={"auto"} flexDirection="column" height={"100%"}>
            <AirportSelectionForm submitForm={getDestinations} />
            <FeedbackForm/>
            <Text color={"white"} margin={"20px"}>
              Copyright © Sergey Dubovyk 2023
            </Text>
          </Center>
        </Box>
        <Box flex="1" h={"100%"} overflow={"auto"}>
          {/*<Tabs height={"93%"} isLazy>*/}
          {/*  <TabList>*/}
          {/*    <Tab>List</Tab>*/}
          {/*    <Tab>Map</Tab>*/}
          {/*  </TabList>*/}
          {/*  <TabPanels height={"100%"}>*/}
          {/*    <TabPanel>*/}
          <RouteSuggestionsList loading={loading} destinations={destinations} />
          {/*  </TabPanel>*/}
          {/*  <TabPanel height={"100%"}>*/}
          {/*    <LeafletMapComponent*/}
          {/*      loading={loading}*/}
          {/*      destinations={destinations}*/}
          {/*    />*/}
          {/*  </TabPanel>*/}
          {/*</TabPanels>*/}
          {/*</Tabs>*/}
        </Box>
      </Flex>
    </>
  );
};

export default Home;
