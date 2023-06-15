import { Accordion, Center, Spinner } from "@chakra-ui/react";
import RouteSuggestionItem from "./RouteSuggestionItem";
import { Airport } from "../../pages/api/interfaces";

export default function RouteSuggestionsList({
  loading,
  destinations,
}: {
  loading: boolean;
  destinations: { from: string; airports: Airport[] };
}) {
  return (
    <>
      {loading ? (
        <Center marginTop={"10%"}>
          <Spinner
            size={"xl"}
            thickness="4px"
            color="#D90368"
            emptyColor="#F1E9DA"
          />
        </Center>
      ) : (
        <Accordion defaultIndex={[]} allowMultiple>
          {destinations?.airports ? (
            destinations.airports.map((item: Airport) => {
              try {
                return (
                  <RouteSuggestionItem
                    from={destinations.from}
                    key={item.ident}
                    airport={item}
                  />
                );
              } catch (e) {
                return undefined;
              }
            })
          ) : (
            <></>
          )}
        </Accordion>
      )}
    </>
  );
}
