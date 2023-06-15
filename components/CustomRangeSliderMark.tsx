import { RangeSliderMark } from "@chakra-ui/react";

export function CustomRangeSliderMark({
  value,
  formatter,
}: {
  value: number;
  formatter?: (val: number) => string;
}) {
  return (
    <RangeSliderMark
      textAlign="center"
      color="white"
      mt="-10"
      ml="-5"
      w="14"
      h="20px"
      value={value}
    >
      {formatter ? formatter(value) : value}
    </RangeSliderMark>
  );
}
