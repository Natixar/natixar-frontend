import { useRef, useState, ReactNode, SyntheticEvent } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import {
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"

// project import
import Avatar from "components/@extended/Avatar"
import MainCard from "components/MainCard"
import Transitions from "components/@extended/Transitions"
import IconButton from "components/@extended/IconButton"

// assets
import avatar1 from "assets/images/users/avatar-1.png"
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons"

// types
import { ThemeMode } from "types/config"
import { useFusionAuth } from "@fusionauth/react-sdk"
import { getFusionConfig } from "utils/route-guard/FusionConfiguration"
import SettingTab from "./SettingTab"
import ProfileTab from "./ProfileTab"

// types
interface TabPanelProps {
  children?: ReactNode
  dir?: string
  index: number
  value: number
}

// tab panel wrapper
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  }
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  }
}

const Profile = () => {
  const theme = useTheme()

  const { logout, user } = useFusionAuth()
  const { enabled: isFusionEnabled } = getFusionConfig()
  const handleLogout = async () => {
    if (!isFusionEnabled || isFusionEnabled === "false") {
      return
    }
    try {
      await logout()
    } catch (err) {
      console.error(err)
    }
  }

  const anchorRef = useRef<any>(null)
  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const iconBackColorOpen =
    theme.palette.mode === ThemeMode.DARK
      ? "background.default"
      : "primary.light"
  const userName =
    user?.given_name && user?.family_name
      ? `${user?.given_name} ${user?.family_name}`
      : "Natixar User"

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75, pr: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : "primary.main",
          borderRadius: 1,
          "&:hover": {
            bgcolor:
              theme.palette.mode === ThemeMode.DARK
                ? "primary.lighter"
                : "primary.light",
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ p: 0.5 }}
        >
          <Avatar {...stringAvatar(userName)} />
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "common.white",
            }}
          >
            {userName}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        sx={{ zIndex: "10" }}
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
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
          <Transitions
            type="grow"
            position="top-right"
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down("md")]: {
                  maxWidth: 250,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          <Stack direction="column">
                            <Typography variant="h6">{userName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}{" "}
                              {user.email_verified && (
                                <Tooltip title="Email verified">
                                  <VerifiedUserIcon color="success" />
                                </Tooltip>
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton
                            size="large"
                            sx={{ color: "text.primary" }}
                            onClick={handleLogout}
                          >
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="profile tabs"
                    >
                      <Tab
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          textTransform: "capitalize",
                        }}
                        icon={
                          <UserOutlined
                            style={{ marginBottom: 0, marginRight: "10px" }}
                          />
                        }
                        label="Profile"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          textTransform: "capitalize",
                        }}
                        icon={
                          <SettingOutlined
                            style={{ marginBottom: 0, marginRight: "10px" }}
                          />
                        }
                        label="Settings"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab handleLogout={handleLogout} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  )
}

export default Profile
