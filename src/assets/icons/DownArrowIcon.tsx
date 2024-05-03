import { SvgIcon } from "@mui/material"
import { SvgIconPropsWithCustomColor } from './ExtendedSvgProps'

export const DownArrowIcon = ({ customColor, ...props }: SvgIconPropsWithCustomColor) => (
  <SvgIcon {...props} sx={{ maxWidth: '16px', ...props.sx }}>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.00002 7.24981C6.00653 7.24949 6.01304 7.25039 6.01954 7.24978C6.1405 7.25002 6.26063 7.20095 6.3435 7.10224L10.9046 1.67094C11.0514 1.49618 11.0259 1.23766 10.8477 1.09358C10.6694 0.949553 10.4057 0.974558 10.2589 1.14943L6.00002 6.22084L1.74111 1.14943C1.5943 0.974558 1.33067 0.949553 1.15235 1.09358C1.05193 1.17466 1 1.29208 1 1.41041C1 1.50219 1.03128 1.59455 1.0954 1.67094L5.65654 7.10224C5.73941 7.20095 5.85954 7.25002 5.9805 7.24978C5.987 7.25039 5.99351 7.24949 6.00002 7.24981Z" fill={customColor} stroke={customColor} />
    </svg>
  </SvgIcon>
)
