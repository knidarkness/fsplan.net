import {
  AbsoluteCenter,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { RunwayInfo } from "./runwayInfo";
import { Airport } from "../../pages/api/interfaces";

export default function RunwaysBlock({ airport }: { airport: Airport }) {
  return (
    <>
      <Card style={{ margin: "5px", minWidth: "200px" }}>
        <CardHeader style={{ paddingBottom: "5px" }}>
          <Heading as={"h4"} size={"md"}>
            Runways
          </Heading>
        </CardHeader>
        <CardBody>
          {airport.runways.map((runway) => {
            return (
              <div key={runway.le_ident}>
                <Box position="relative" padding="5">
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    <Heading size={"sm"} as={"h5"}>
                      {runway.le_ident}-{runway.he_ident}<br/>{runway.length_ft}ft<br/>{runway.surface}
                    </Heading>
                  </AbsoluteCenter>
                </Box>
                <div key={`${airport.ident}.${runway.le_ident}`}>
                  <RunwayInfo airport={airport} runwayIdent={runway.le_ident} />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </>
  );
}
