import { Accordion, Center, Spinner } from "@chakra-ui/react";
import RouteSuggestionItem from "./RouteSuggestionItem";
import { Airport } from "../../pages/api/interfaces";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import NoAirportsFound from "../NoAirportsFound";


function PaginatedItems({destinations: items}: {destinations: { from: string; airports: Airport[] };}) {
  const ELEMENTS_PER_PAGE = 20;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + ELEMENTS_PER_PAGE;
  const currentItems = items.airports.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.airports.length / ELEMENTS_PER_PAGE);

  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = (event.selected * ELEMENTS_PER_PAGE) % items.airports.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Accordion defaultIndex={[]} allowMultiple>
        {currentItems ? (
          currentItems.map((item: Airport) => {
            try {
              return (
                <RouteSuggestionItem
                  from={items.from}
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
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        className="react-paginate"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

function RouteSearchResultOrNotFound({ destinations }: {destinations: { from: string; airports: Airport[] };}) {
  return ((destinations && destinations.airports.length > 0) ? (<PaginatedItems destinations={destinations}/>) : (<NoAirportsFound/>))
}

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
      ) :
        <RouteSearchResultOrNotFound destinations={destinations}/>
      }
    </>
  );
}
