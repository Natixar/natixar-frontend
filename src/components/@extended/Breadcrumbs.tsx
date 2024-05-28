import { CSSProperties, ReactElement, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

// material-ui
import { useTheme } from "@mui/material/styles"
import { Divider, Grid, Typography } from "@mui/material"
import MuiBreadcrumbs from "@mui/material/Breadcrumbs"

// project import
import MainCard from "components/MainCard"
import navigation from "menu-items"

// assets
import { ApartmentOutlined, HomeOutlined, HomeFilled } from "@ant-design/icons"

// types
import { ThemeDirection } from "types/config"
import { OverrideIcon } from "types/root"
import { NavItemType } from "types/menu"

interface BreadcrumbLinkProps {
  title: string
  to?: string
  icon?: string | OverrideIcon
}

// ==============================|| BREADCRUMBS ||============================== //

export interface BreadCrumbSxProps extends CSSProperties {
  mb?: string
  bgcolor?: string
}

interface Props {
  card?: boolean
  custom?: boolean
  divider?: boolean
  heading?: string
  icon?: boolean
  icons?: boolean
  links?: BreadcrumbLinkProps[]
  maxItems?: number
  rightAlign?: boolean
  separator?: OverrideIcon
  title?: boolean
  titleBottom?: boolean
  sx?: BreadCrumbSxProps
}

const Breadcrumbs = ({
  card = false,
  custom = false,
  divider = false,
  heading,
  icon,
  icons,
  links,
  maxItems,
  rightAlign,
  separator,
  title = true,
  titleBottom = true,
  sx,
  ...others
}: Props) => {
  const theme = useTheme()
  const location = useLocation()
  const [main, setMain] = useState<NavItemType | undefined>()
  const [item, setItem] = useState<NavItemType>()

  const iconSX = {
    marginRight:
      theme.direction === ThemeDirection.RTL ? 0 : theme.spacing(0.75),
    marginLeft:
      theme.direction === ThemeDirection.RTL ? theme.spacing(0.75) : 0,
    width: "1rem",
    height: "1rem",
    color: theme.palette.secondary.main,
  }

  let customLocation = location.pathname

  // only used for component demo breadcrumbs
  if (customLocation.includes("/components-overview/breadcrumbs")) {
    customLocation = "/apps/customer/customer-card"
  }

  // set active item state
  const getCollapse = (menu: NavItemType) => {
    if (!custom && menu.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === "collapse") {
          getCollapse(collapse as { children: NavItemType[]; type?: string })
          if (collapse.url === customLocation) {
            setMain(collapse)
            setItem(collapse)
          }
        } else if (collapse.type && collapse.type === "item") {
          if (customLocation === collapse.url) {
            setMain(menu)
            setItem(collapse)
          }
        }
        return false
      })
    }
  }

  useEffect(() => {
    navigation?.items?.map((menu: NavItemType) => {
      if (menu.type && menu.type === "group") {
        if (menu?.url && menu.url === customLocation) {
          setMain(menu)
          setItem(menu)
        } else {
          getCollapse(menu as { children: NavItemType[]; type?: string })
        }
      }
      return false
    })
  })

  // item separator
  const SeparatorIcon = separator!
  const separatorIcon = separator ? (
    <SeparatorIcon style={{ fontSize: "0.75rem", marginTop: 2 }} />
  ) : (
    "/"
  )

  let mainContent
  let itemContent
  let breadcrumbContent: ReactElement = <Typography />
  let itemTitle: NavItemType["title"] = ""
  let CollapseIcon
  let ItemIcon

  // collapse item
  if (
    !custom &&
    main &&
    main.type === "collapse" &&
    main.breadcrumbs === true
  ) {
    CollapseIcon = main.icon ? main.icon : ApartmentOutlined
    mainContent = (
      <Typography
        component={Link}
        to={main.url as string}
        variant={window.location.pathname === main.url ? "subtitle1" : "h6"}
        sx={{ textDecoration: "none" }}
        color={
          window.location.pathname === main.url
            ? "text.primary"
            : "text.secondary"
        }
      >
        {icons && <CollapseIcon style={iconSX} />}
        {main.title}
      </Typography>
    )
    const mainCardStyle = {
      mb: 3,
      borderRadius: 0,
      ...(!card && { bgcolor: "transparent" }),
      ...sx,
    }
    breadcrumbContent = (
      <MainCard
        border={card}
        sx={mainCardStyle}
        {...others}
        content={card}
        shadow="none"
      >
        <Grid
          container
          direction={rightAlign ? "row" : "column"}
          justifyContent={rightAlign ? "space-between" : "flex-start"}
          alignItems={rightAlign ? "center" : "flex-start"}
          spacing={1}
        >
          <Grid item>
            <MuiBreadcrumbs
              aria-label="breadcrumb"
              maxItems={maxItems || 8}
              separator={separatorIcon}
            >
              <Typography
                component={Link}
                to="/"
                color="textSecondary"
                variant="h6"
                sx={{ textDecoration: "none" }}
              >
                {icons && <HomeOutlined style={iconSX} />}
                {icon && !icons && (
                  <HomeFilled style={{ ...iconSX, marginRight: 0 }} />
                )}
                {(!icon || icons) && "Home"}
              </Typography>
              {mainContent}
            </MuiBreadcrumbs>
          </Grid>
          {title && titleBottom && (
            <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
              <Typography variant="h2">{main.title}</Typography>
            </Grid>
          )}
        </Grid>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </MainCard>
    )
  }

  // items
  if (
    (item && item.type === "item") ||
    (item?.type === "group" && item?.url) ||
    custom
  ) {
    itemTitle = item?.title

    ItemIcon = item?.icon ? item.icon : ApartmentOutlined
    itemContent = (
      <Typography variant="subtitle1" color="textPrimary">
        {icons && <ItemIcon style={iconSX} />}
        {itemTitle}
      </Typography>
    )

    let tempContent = (
      <MuiBreadcrumbs
        aria-label="breadcrumb"
        maxItems={maxItems || 8}
        separator={separatorIcon}
      >
        <Typography
          component={Link}
          to="/"
          color="textSecondary"
          variant="h6"
          sx={{ textDecoration: "none" }}
        >
          {icons && <HomeOutlined style={iconSX} />}
          {icon && !icons && (
            <HomeFilled style={{ ...iconSX, marginRight: 0 }} />
          )}
          {(!icon || icons) && "Home"}
        </Typography>
        {mainContent}
        {itemContent}
      </MuiBreadcrumbs>
    )

    if (custom && links && links?.length > 0) {
      tempContent = (
        <MuiBreadcrumbs
          aria-label="breadcrumb"
          maxItems={maxItems || 8}
          separator={separatorIcon}
          sx={{
            width: "50vw",
            "& .MuiBreadcrumbs-ol": { justifyContent: "center" },
            "& .MuiBreadcrumbs-li": { "max-width": `${100 / links.length}%` },
          }}
        >
          {links?.map((link: BreadcrumbLinkProps, index: number) => {
            CollapseIcon = link.icon ? link.icon : ApartmentOutlined

            return (
              <Typography
                key={index}
                {...(link.to && { component: Link, to: link.to })}
                variant={!link.to ? "subtitle1" : "h6"}
                sx={{
                  textDecoration: "none",
                  maxWidth: "fit-content",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                color={!link.to ? "text.primary" : "#1890FF"}
              >
                {link.icon && <CollapseIcon style={iconSX} />}
                {link.title}
              </Typography>
            )
          })}
        </MuiBreadcrumbs>
      )
    }

    // main
    if (item?.breadcrumbs !== false || custom) {
      const mainCardStyle = {
        mb: 3,
        borderRadius: 0,
        ...(!card && { bgcolor: "transparent" }),
        ...sx,
      }
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={mainCardStyle}
          {...others}
          content={card}
          shadow="none"
        >
          <Grid
            container
            direction={rightAlign ? "row" : "column"}
            justifyContent={rightAlign ? "space-between" : "flex-start"}
            alignItems={rightAlign ? "center" : "flex-start"}
            spacing={1}
          >
            {title && !titleBottom && (
              <Grid item>
                <Typography variant="h2">
                  {custom ? heading : item?.title}
                </Typography>
              </Grid>
            )}
            <Grid item>{tempContent}</Grid>
            {title && titleBottom && (
              <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
                <Typography variant="h2">
                  {custom ? heading : item?.title}
                </Typography>
              </Grid>
            )}
          </Grid>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </MainCard>
      )
    }
  }

  return breadcrumbContent
}

export default Breadcrumbs
