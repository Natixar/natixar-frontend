import { SvgIcon } from "@mui/material"
import { SvgIconPropsWithCustomColor } from './ExtendedSvgProps'

export const ExportIcon = ({ customColor = '#fff', ...props }: SvgIconPropsWithCustomColor) => (
  <SvgIcon {...props} sx={{ maxWidth: '16px', ...props.sx }}>
    <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.11009 0.320361L14.9352 6.22722C15.9606 7.2557 14.4224 8.79878 13.3966 7.7703L9.96767 4.3311C9.68112 4.04368 9.45199 4.13845 9.45199 4.53886V16.4542C9.45199 17.0568 8.96499 17.5452 8.36413 17.5452C7.76327 17.5452 7.27627 17.0568 7.27627 16.4542V4.53886C7.27627 4.13902 7.04537 4.04544 6.76054 4.3311L3.33134 7.7703C2.30585 8.79878 0.767254 7.2557 1.79274 6.22722L7.58 0.323639C8.00135 -0.106189 8.68719 -0.108469 9.11009 0.320361ZM1.09095 24C0.488436 24 0 23.5116 0 22.909C0 22.3065 0.488436 21.8181 1.09095 21.8181H15.637C16.2395 21.8181 16.7279 22.3065 16.7279 22.909C16.7279 23.5116 16.2395 24 15.637 24H1.09095Z" fill={customColor} />
    </svg>
  </SvgIcon>
)
