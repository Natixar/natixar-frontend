import { useEffect } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import { useMediaQuery, Box, Container, Toolbar, Stack } from "@mui/material"

// project import
import Loader from "components/Loader"
import AuthGuard from "utils/route-guard/AuthGuard"

import useConfig from "hooks/useConfig"
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu"

// types
import { MenuOrientation } from "types/config"
import { Outlet, useLocation } from "react-router-dom"
import HorizontalBar from "./Drawer/HorizontalBar"
import Header from "./Header"
import Drawer from "./Drawer"

// ==============================|| MAIN LAYOUT ||============================== //

const pathnamesOfInterest = ["", "/", "/contributors/dashboard"]

const AppLayout = () => {
  const theme = useTheme()
  const { menuMasterLoading } = useGetMenuMaster()
  const matchDownXL = useMediaQuery(theme.breakpoints.down("xl"))
  const downLG = useMediaQuery(theme.breakpoints.down("lg"))
  const { pathname } = useLocation()

  const { container, miniDrawer, menuOrientation, isShowExtraHeader } =
    useConfig()

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      handlerDrawerOpen(!matchDownXL)
    }
  }, [matchDownXL])

  if (menuMasterLoading) return <Loader />
  const makeExtraPadding = pathnamesOfInterest.includes(pathname)

  return (
    <AuthGuard>
      <Box sx={{ display: "flex", width: "100%", minHeight: "100dvh" }}>
        <Header />
        {!isHorizontal ? <Drawer /> : <HorizontalBar />}

        <Stack
          component="main"
          sx={{
            bgcolor: "common.white",
            width: "calc(100% - 260px)",
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
          }}
        >
          {makeExtraPadding && (
            <Toolbar sx={{ mt: isHorizontal ? 8 : "inherit" }} />
          )}
          <Container
            maxWidth={container ? "xl" : false}
            sx={{
              ...(container && { px: { xs: 0, sm: 3 } }),
              position: "relative",
              top: 60,
              minHeight: "calc(100vh - 110px)",
              display: "flex",
              flexDirection: "column",
              paddingTop: isShowExtraHeader && makeExtraPadding ? 17 : 9,
            }}
          >
            <Outlet />
          </Container>
        </Stack>
      </Box>
    </AuthGuard>
  )
}

export default AppLayout
