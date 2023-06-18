import { Box, Heading } from "@chakra-ui/react";

export default function NoAirportsFound() {
  return <Box border={"1px"}
              boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
              borderColor={"#808080"}
              m={"15px"}
              padding={"10px"}
              borderRadius={"5px"}>
    <Heading as={"h4"} size={"lg"}>
      No matching destinations
    </Heading>
    No airports found matching your criteria. Try allowing "derived METAR" option to include airports without their own METAR or use less strict criteria set.
  </Box>;
}
