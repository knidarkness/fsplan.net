import {
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { airportFiltersActions } from "../store/store";
import { useDispatch } from "react-redux";
import { RangeTextInput } from "./RangeTextInput";
import { CheckBoxInput } from "./CheckBoxInput";

export const AirportSelectionForm = ({
  submitForm,
}: {
  submitForm: () => any;
}) => {
  const dispatch = useDispatch();

  return (
    <>
      <FormControl>
        <Heading color={"white"} as="h3" size="md">
          Departure airport
        </Heading>
        <InputGroup marginTop={2} marginRight={2}>
          <InputLeftAddon>ICAO</InputLeftAddon>
          <Input
            color={"rgba(255,255,255,0.92)"}
            placeholder={"Airport ICAO code (e.g. LOWI)"}
            onInput={(e) =>
              dispatch(
                airportFiltersActions.setDepartureAirport(
                  (e.target as HTMLInputElement).value.toUpperCase()
                )
              )
            }
          />
        </InputGroup>
      </FormControl>
      <RangeTextInput
        name={"Flight range"}
        range={{ min: 1, max: 5000 }}
        setMin={(value) =>
          dispatch(airportFiltersActions.setDistanceMin(value))
        }
        setMax={(value) =>
          dispatch(airportFiltersActions.setDistanceMax(value))
        }
      />
      <RangeTextInput
        name={"Runway Length (ft)"}
        range={{ min: 0, max: 20000 }}
        setMin={(value) =>
          dispatch(airportFiltersActions.setRunwayLengthMin(value))
        }
        setMax={(value) =>
          dispatch(airportFiltersActions.setRunwayLengthMax(value))
        }
      />
      <RangeTextInput
        name={"Visibility/RVR (m)"}
        range={{ min: 0, max: 10000 }}
        setMin={(value) =>
          dispatch(airportFiltersActions.setVisibilityMin(value))
        }
        setMax={(value) =>
          dispatch(airportFiltersActions.setVisibilityMax(value))
        }
      />
      <RangeTextInput
        name={"Ceiling (ft)"}
        range={{ min: 0, max: 10000 }}
        setMin={(value) => dispatch(airportFiltersActions.setCeilingMin(value))}
        setMax={(value) => dispatch(airportFiltersActions.setCeilingMax(value))}
      />
      <RangeTextInput
        name={"Wind (kts)"}
        range={{ min: 0, max: 50 }}
        setMin={(value) =>
          dispatch(airportFiltersActions.setWindMin(value))
        }
        setMax={(value) =>
          dispatch(airportFiltersActions.setWindMax(value))
        }
      />
      <CheckBoxInput
        name={"Derived Weather"}
        setValue={(value) =>
          dispatch(airportFiltersActions.setAllowDerivedMetar(value))
        }
      />
      <Button width={"100%"} bg={"#efe5e5"} onClick={submitForm}>
        Find
      </Button>
    </>
  );
};
