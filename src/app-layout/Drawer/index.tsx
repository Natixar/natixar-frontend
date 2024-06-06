import { useMemo } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import { Box, Drawer, useMediaQuery } from "@mui/material"

// project import
import { DRAWER_WIDTH } from "config"
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu"
import DrawerHeader from "./DrawerHeader"
import DrawerContent from "./DrawerContent"
import MiniDrawerStyled from "./MiniDrawerStyled"

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

interface Props {
  window?: () => Window
}

const MainDrawer = ({ window }: Props) => {
  const theme = useTheme()
  const { menuMaster } = useGetMenuMaster()
  const drawerOpen = menuMaster.isDashboardDrawerOpened
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"))

  // responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, [])
  const drawerHeader = useMemo(
    () => <DrawerHeader open={drawerOpen} />,
    [drawerOpen],
  )

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}
      aria-label="mailbox folders"
    >
      {!matchDownMD ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              backgroundImage: "linear-gradient(#053759,#0B76BF)",
              boxShadow: "inherit",
            },
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  )
}

export default MainDrawer
