// material-ui
import { Theme } from "@mui/material/styles"
import { Box, Stack, useMediaQuery } from "@mui/material"

// project import
import NetworkIndicator from "components/network/NetworkIndicator"
import Profile from "./Profile"
import Customization from "./Customization"
import MobileSection from "./MobileSection"

const HeaderContent = () => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"))

  return (
    <>
      {!downLG && <Box sx={{ width: "100%" }} />}
      {downLG && <Box sx={{ width: "100%", ml: 1 }} />}

      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        paddingRight={1}
        sx={{
          px: 1,
        }}
      >
        {/* <Notification /> */}
        <Customization />
        <NetworkIndicator />
        {!downLG && <Profile />}
        {downLG && <MobileSection />}
      </Stack>
    </>
  )
}

export default HeaderContent
