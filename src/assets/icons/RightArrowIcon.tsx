import { SvgIcon } from "@mui/material"
import { SvgIconPropsWithCustomColor } from './ExtendedSvgProps'

export const RightArrowIcon = ({ customColor, ...props }: SvgIconPropsWithCustomColor) => (
  <SvgIcon {...props} sx={{ maxWidth: '16px', ...props.sx }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d="M7.24981 5.99998C7.24949 5.99347 7.25039 5.98696 7.24978 5.98046C7.25002 5.8595 7.20095 5.73937 7.10224 5.6565L1.67094 1.09536C1.49618 0.948553 1.23766 0.974111 1.09358 1.15231C0.949553 1.33063 0.974558 1.59426 1.14943 1.74107L6.22084 5.99998L1.14943 10.2589C0.974558 10.4057 0.949553 10.6693 1.09358 10.8476C1.17466 10.9481 1.29208 11 1.41041 11C1.50219 11 1.59455 10.9687 1.67094 10.9046L7.10224 6.34346C7.20095 6.26059 7.25002 6.14046 7.24978 6.0195C7.25039 6.013 7.24949 6.00649 7.24981 5.99998Z" fill={customColor} stroke={customColor} />
    </svg>
  </SvgIcon>
)
