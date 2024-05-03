import { ReactNode, useMemo } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import { AppBar, Toolbar, useMediaQuery, AppBarProps } from "@mui/material"

// project import
import IconButton from "components/@extended/IconButton"
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "config"
import useConfig from "hooks/useConfig"
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu"

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"

// types
import { MenuOrientation, ThemeMode } from "types/config"
import { useLocation } from "react-router"
import SubHeaderContent from "./SubHeaderContent"
import HeaderContent from "./HeaderContent"
import ExtraHeaderContent from "./ExtraHeaderContent"
import AppBarStyled from "./AppBarStyled"

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const pathnamesOfInterest = ["", "/", "/contributors/dashboard"]

const Header = () => {
  const theme = useTheme()
  const { pathname } = useLocation()
  const downLG = useMediaQuery(theme.breakpoints.down("lg"))
  const { menuOrientation, isShowExtraHeader } = useConfig()

  const { menuMaster } = useGetMenuMaster()
  const drawerOpen = menuMaster.isDashboardDrawerOpened

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG

  // header content
  const headerContent = useMemo(() => <HeaderContent />, [])
  const subHeaderContent = useMemo(() => <SubHeaderContent />, [])
  const extraHeaderContent = useMemo(() => <ExtraHeaderContent />, [])

  const iconBackColor =
    theme.palette.mode === ThemeMode.DARK ? "background.default" : "grey.100"

  // common header
  const mainHeader: ReactNode = (
    <Toolbar sx={{ bgcolor: "primary.main" }}>
      {!isHorizontal ? (
        <IconButton
          aria-label="open drawer"
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          edge="start"
          variant="light"
          sx={{
            color: "common.white",
            bgcolor: "transparent",
            ml: { xs: 0, lg: -2 },
          }}
        >
          {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  )

  const subHeader: ReactNode = (
    <Toolbar sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
      {subHeaderContent}
    </Toolbar>
  )

  const extraHeader: ReactNode = (
    <Toolbar sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
      {extraHeaderContent}
    </Toolbar>
  )

  // app-bar params
  const appBar: AppBarProps = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: isHorizontal
        ? "100%"
        : {
          xs: "100%",
          lg: drawerOpen
            ? `calc(100% - ${DRAWER_WIDTH}px)`
            : `calc(100% - ${MINI_DRAWER_WIDTH}px)`,
        },
    },
  }

  return (
    <div>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
          {!pathnamesOfInterest.includes(pathname) ? null : subHeader}
          {isShowExtraHeader && extraHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </div>
  )
}

export default Header
