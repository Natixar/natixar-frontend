import { SvgIconPropsWithCustomColor } from './ExtendedSvgProps'
import { SvgIcon } from "@mui/material"

export const UpArrowIcon = ({ customColor, ...props }: SvgIconPropsWithCustomColor) => (
  <SvgIcon {...props} sx={{ maxWidth: '16px', ...props.sx }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M5.99998 1.00019C5.99347 1.00051 5.98696 0.999608 5.98046 1.00022C5.8595 0.99998 5.73937 1.04905 5.6565 1.14776L1.09536 6.57906C0.948553 6.75382 0.974111 7.01234 1.15231 7.15642C1.33063 7.30045 1.59426 7.27544 1.74107 7.10057L5.99998 2.02916L10.2589 7.10057C10.4057 7.27544 10.6693 7.30045 10.8476 7.15642C10.9481 7.07534 11 6.95792 11 6.83959C11 6.74781 10.9687 6.65545 10.9046 6.57906L6.34346 1.14776C6.26059 1.04905 6.14046 0.99998 6.0195 1.00022C6.013 0.999608 6.00649 1.00051 5.99998 1.00019Z" fill={customColor} stroke={customColor} />
    </svg>
  </SvgIcon>
)

