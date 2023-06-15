import {
  Box,
  FormControl,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import { useState } from "react";

export function RangeSliderInput({
  dispatch,
  range,
  currentSelection,
  name,
  customMarkFormatters,
}: {
  name: string;
  dispatch: (value: any) => any;
  range: { min: number; max: number };
  currentSelection: {
    min: number;
    max: number;
  };
  customMarkFormatters?: {
    min?: (val: number) => string;
    max?: (val: number) => string;
  };
}) {
  const [min, setMin] = useState(range.min);
  const [max, setMax] = useState(range.max);
  return (
    <FormControl
      border={"2px solid white"}
      borderRadius={"10px"}
      paddingLeft={"15px"}
      paddingRight={"15px"}
      marginTop={"10px"}
      marginBottom={"10px"}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <span
          style={{ width: "20%", display: "inline-block", color: "#ffffff" }}
        >
          {customMarkFormatters?.min ? customMarkFormatters?.min(min) : min}
        </span>
        <span
          style={{
            flexGrow: 1,
            textAlign: "center",
            display: "inline-block",
            color: "#ffffff",
          }}
        >
          {name}
        </span>
        <span
          style={{ width: "20%", display: "inline-block", color: "#ffffff" }}
        >
          {customMarkFormatters?.max ? customMarkFormatters?.max(max) : max}
        </span>
      </Box>
      <RangeSlider
        defaultValue={[range.min, range.max]}
        min={range.min}
        max={range.max}
        marginTop={"20px"}
        onChange={(val) => {
          setMin(val[0]);
          setMax(val[1]);
        }}
        onChangeEnd={(val) =>
          dispatch({
            min: val[0],
            max: val[1],
          })
        }
      >
        <RangeSliderTrack bg="red.100">
          <RangeSliderFilledTrack bg="#37000A" />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0}>
          <Box color="tomato" as={MdGraphicEq} />
        </RangeSliderThumb>
        <RangeSliderThumb boxSize={6} index={1}>
          <Box color="tomato" as={MdGraphicEq} />
        </RangeSliderThumb>
      </RangeSlider>
    </FormControl>
  );
}
