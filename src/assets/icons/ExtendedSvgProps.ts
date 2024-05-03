import { SvgIconProps } from "@mui/material";

// Define an interface extending SvgIconProps
export interface SvgIconPropsWithCustomColor extends SvgIconProps {
  customColor?: string; // Make customColor optional with a type of string
}
