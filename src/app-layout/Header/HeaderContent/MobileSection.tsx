import { useEffect, useRef, useState } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import {
  AppBar,
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  Toolbar,
} from "@mui/material"

// project import
import IconButton from "components/@extended/IconButton"
import Transitions from "components/@extended/Transitions"

// assets
import { MoreOutlined } from "@ant-design/icons"

// types
import { ThemeMode } from "types/config"
import Localization from "./Localization"
import Profile from "./Profile"
import Search from "./Search"

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

const MobileSection = () => {
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<any>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  const iconBackColorOpen =
    theme.palette.mode === ThemeMode.DARK ? "grey.200" : "grey.300"
  const iconBackColor =
    theme.palette.mode === ThemeMode.DARK ? "background.default" : "grey.100"

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          sx={{
            color: "text.primary",
            bgcolor: open ? iconBackColorOpen : iconBackColor,
          }}
          aria-label="open more menu"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="secondary"
          variant="light"
        >
          <MoreOutlined />
        </IconButton>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          zIndex: 43,
          position: "relative",
        }}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <AppBar color="inherit">
                  <Toolbar>
                    <Search />
                    <Localization />
                    <Profile />
                  </Toolbar>
                </AppBar>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  )
}

export default MobileSection
