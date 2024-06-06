import { Stack, Typography } from "@mui/material"

import ByCompanySection from "sections/charts/emissions/ByCompanySection"
import ByCountrySection from "sections/charts/emissions/ByCountrySection"
import ClusteredMapSection from "sections/maps-leaflet/clusters-map/ContributorsDashboardPage"

const ContributorDashboardPage = () => (
  <Stack spacing="22px">
    <Typography variant="h4" gutterBottom>
      Map
    </Typography>
    <Typography variant="body2">
      The map represents your emissions grouped by geographic area. Zoom in or zoom out to a micro or macro view of your emissions.
    </Typography>
    <ClusteredMapSection />
    <ByCompanySection />
    <ByCountrySection />
  </Stack>
)

export default ContributorDashboardPage
