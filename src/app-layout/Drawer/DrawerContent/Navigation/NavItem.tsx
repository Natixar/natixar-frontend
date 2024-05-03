import { Link, useLocation, matchPath } from "react-router-dom"

// material-ui
import { useTheme } from "@mui/material/styles"
import {
  Avatar,
  Box,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material"

// project import
import Dot from "components/@extended/Dot"
import IconButton from "components/@extended/IconButton"

import useConfig from "hooks/useConfig"
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu"

// types
import { MenuOrientation, ThemeMode } from "types/config"
import { LinkTarget, NavActionType, NavItemType } from "types/menu"

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
  item: NavItemType
  level: number
  isParents?: boolean
}

const NavItem = ({ item, level, isParents = false }: Props) => {
  const theme = useTheme()

  const { menuMaster } = useGetMenuMaster()
  const drawerOpen = menuMaster.isDashboardDrawerOpened

  const downLG = useMediaQuery(theme.breakpoints.down("lg"))

  const { menuOrientation, setIsShowExtraHeader } = useConfig()
  let itemTarget: LinkTarget = "_self"
  if (item.target) {
    itemTarget = "_blank"
  }

  const iconSelectedColor =
    theme.palette.mode === ThemeMode.DARK && drawerOpen
      ? "#fff"
      : "#fff"
  const Icon = item.icon!
  const itemIcon = item.icon ? (
    <Icon
      style={{
        color: iconSelectedColor,
        fontSize: drawerOpen ? "1rem" : "1.25rem",
        ...(menuOrientation === MenuOrientation.HORIZONTAL &&
          isParents && { fontSize: 20, stroke: "1.5" }),
      }}
    />
  ) : (
    false
  )

  const { pathname } = useLocation()
  const path = item?.link ? item.link : item.url!
  const isSelected =
    path === "" || path === "/"
      ? path === pathname
      : !!matchPath({ path, end: false }, pathname)

  const textColor =
    theme.palette.mode === ThemeMode.DARK ? "grey.400" : "common.white"
  // bgColor for selected and hover on item
  const bgcolor = theme.palette.mode === ThemeMode.DARK ? "divider" : "primary.light";

  const handleItemClick = () => {
    setIsShowExtraHeader(false)
  }

  return (
    <div>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <Box sx={{ position: "relative" }}>
          <ListItemButton
            component={Link}
            to={item.url!}
            onClick={handleItemClick}
            target={itemTarget}
            disabled={item.disabled}
            selected={isSelected}
            sx={{
              zIndex: 1201,
              pl: drawerOpen ? `${level * 28}px` : 1.5,
              py: !drawerOpen && level === 1 ? 1.25 : 1,
              ...(drawerOpen && {
                ml: '16px',
                pl: `${level * 8}px`,
                pr: '8px',
                py: !drawerOpen && level === 1 ? 1.2 : 1,
                width: 224,
                my: "4px",
                borderRadius: '12px',
                "&:hover": {
                  bgcolor,
                },
                "&.Mui-selected": {
                  bgcolor,
                  "&:hover": {
                    bgcolor,
                  },
                },
              }),
              ...(!drawerOpen && {
                "&:hover": {
                  bgcolor: "transparent",
                },
                "&.Mui-selected": {
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  bgcolor: "transparent",
                },
              }),
            }}
            {...(downLG && {
              onClick: () => handlerDrawerOpen(false),
            })}
          >
            {itemIcon && (
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  ...(!drawerOpen && {
                    borderRadius: 1.5,
                    width: 36,
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      bgcolor,
                    },
                  }),
                  ...(!drawerOpen &&
                    isSelected && {
                    bgcolor,
                    "&:hover": {
                      bgcolor,
                    },
                  }),
                }}
              >
                {itemIcon}
              </ListItemIcon>
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && (
              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    sx={{ color: isSelected ? iconSelectedColor : textColor }}
                  >
                    {item.title}
                  </Typography>
                }
              />
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
              <Chip
                color={item.chip.color}
                variant={item.chip.variant}
                size={item.chip.size}
                label={item.chip.label}
                avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
              />
            )}
          </ListItemButton>
          {(drawerOpen || (!drawerOpen && level !== 1)) &&
            item?.actions &&
            item?.actions.map((action, index) => {
              const ActionIcon = action.icon!
              const callAction = action?.function
              return (
                <IconButton
                  key={index}
                  {...(action.type === NavActionType.FUNCTION && {
                    onClick: (event) => {
                      event.stopPropagation()
                      callAction()
                    },
                  })}
                  {...(action.type === NavActionType.LINK && {
                    component: Link,
                    to: action.url,
                    target: action.target ? "_blank" : "_self",
                  })}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 20,
                    zIndex: 1202,
                    width: 20,
                    height: 20,
                    mr: -1,
                    ml: 1,
                    color: "secondary.dark",
                    borderColor: isSelected
                      ? "primary.light"
                      : "secondary.light",
                    "&:hover": {
                      borderColor: isSelected
                        ? "primary.main"
                        : "secondary.main",
                    },
                  }}
                >
                  <ActionIcon style={{ fontSize: "0.625rem" }} />
                </IconButton>
              )
            })}
        </Box>
      ) : (
        // Case Horizontal menu and not downLG
        <ListItemButton
          component={Link}
          to={item.url!}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            "&:hover": {
              bgcolor: "transparent",
            },
            ...(isParents && {
              p: 1,
              mr: 1,
            }),
            "&.Mui-selected": {
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "transparent",
              },
            },
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
                ...(!drawerOpen &&
                  isSelected && {
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          {!itemIcon && (
            <ListItemIcon
              sx={{
                color: isSelected ? "primary.main" : "secondary.dark",
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
                ...(!drawerOpen &&
                  isSelected && {
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
              }}
            >
              <Dot size={4} color={isSelected ? "primary" : "secondary"} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Typography
                variant="h6"
                color={isSelected ? "primary.main" : "secondary.dark"}
              >
                {item.title}
              </Typography>
            }
          />
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      )}
    </div>
  )
}

export default NavItem
