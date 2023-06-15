import { Box, Checkbox, FormControl, Heading } from "@chakra-ui/react";

export function CheckBoxInput({
  setValue,
  name,
}: {
  name: string;
  setValue: (value: any) => any;
}) {
  return (
    <FormControl borderRadius={"10px"} marginTop={"10px"} marginBottom={"10px"}>
      <Heading color={"white"} as="h3" size="md">
        {name}
      </Heading>
      <Box marginTop={2} display={"flex"} justifyContent={"space-between"}>
        <Checkbox
          color={"rgba(255,255,255,0.92)"}
          onChange={(e) => {
            setValue(e.target.checked);
          }}
          marginRight={2}
        >
          Allow derived METAR
        </Checkbox>
      </Box>
    </FormControl>
  );
}
