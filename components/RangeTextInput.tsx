import {
  Box,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";

export function RangeTextInput({
  setMin,
  setMax,
  range,
  name,
}: {
  name: string;
  setMin: (value: any) => any;
  setMax: (value: any) => any;
  range: { min: number; max: number };
}) {
  return (
    <FormControl borderRadius={"10px"} marginTop={"10px"} marginBottom={"10px"}>
      <Heading color={"white"} as="h3" size="md">
        {name}
      </Heading>
      <Box marginTop={2} display={"flex"} justifyContent={"space-between"}>
        <InputGroup marginRight={2}>
          <InputLeftAddon>From</InputLeftAddon>
          <Input
            color={"rgba(255,255,255,0.92)"}
            placeholder={"0"}
            onChange={(e) => {
              if (parseInt(e.target.value) > range.max) {
                e.target.value = range.max.toString();
              }
              if (parseInt(e.target.value) < range.min) {
                e.target.value = range.min.toString();
              }
              setMin(
                parseInt(e.target.value) < range.min
                  ? range.min
                  : parseInt(e.target.value)
              );
            }}
          />
        </InputGroup>
        <InputGroup marginLeft={2}>
          <InputLeftAddon>To</InputLeftAddon>
          <Input
            color={"rgba(255,255,255,0.92)"}
            placeholder={"9999"}
            onChange={(e) => {
              if (parseInt(e.target.value) > range.max) {
                e.target.value = range.max.toString();
              }
              if (parseInt(e.target.value) < range.min) {
                e.target.value = range.min.toString();
              }
              setMax(
                parseInt(e.target.value) > range.max
                  ? range.max
                  : parseInt(e.target.value)
              );
            }}
          />
        </InputGroup>
      </Box>
    </FormControl>
  );
}
