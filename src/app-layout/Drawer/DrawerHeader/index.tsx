// material-ui
import { useTheme } from "@mui/material/styles"
import { useMediaQuery } from "@mui/material"

// project import
import Logo from "components/logo"
import useConfig from "hooks/useConfig"

// types
import { MenuOrientation } from "types/config"
import DrawerHeaderStyled from "./DrawerHeaderStyled"

// ==============================|| DRAWER HEADER ||============================== //

interface Props {
  open: boolean
}

const DrawerHeader = ({ open }: Props) => {
  const theme = useTheme()
  const downLG = useMediaQuery(theme.breakpoints.down("lg"))

  const { menuOrientation } = useConfig()
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? "unset" : "60px",
        width: isHorizontal ? { xs: "100%", lg: "424px" } : "inherit",
        backgroundColor: "#053759",
        paddingTop: isHorizontal ? { xs: "10px", lg: "0" } : "8px",
        paddingBottom: isHorizontal ? { xs: "18px", lg: "0" } : "8px",
        // eslint-disable-next-line no-nested-ternary
        paddingLeft: isHorizontal ? { xs: "24px", lg: "0" } : open ? "24px" : 0,
      }}
    >
      <Logo isIcon={!open} sx={{ width: open ? "auto" : 35, height: 35 }} />
    </DrawerHeaderStyled>
  )
}

export default DrawerHeader
