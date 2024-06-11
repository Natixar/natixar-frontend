import { Grid, Typography } from "@mui/material"

import UnknownMappings from "sections/data-health/UnknownMappingsSection"
import SourcesTable from "./SourcesTable"

const DataPage = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} lg={12} md={12}>
      <Typography variant="h5">Connection status</Typography>
    </Grid>
    <Grid item xs={12} lg={6} md={6}>
      <SourcesTable title="Public Sources" />
    </Grid>
    <Grid item xs={12} lg={6} md={6}>
      <SourcesTable title="Private Data" />
    </Grid>
    {/* uncomment as needed */}
    {/* <Grid item xs={12} lg={12} md={12}> 
      <Typography variant="h5">Data mapping</Typography>
    </Grid>
    <Grid item xs={12} md={12} lg={12}>
      <UnknownMappings />
    </Grid> */}
  </Grid>
)

export default DataPage
