import { useState } from "react"

// material-ui
import { Grid, Typography } from "@mui/material"

// project import
import MainCard from "components/MainCard"

import IncomeAreaChart from "sections/dashboard/default/IncomeAreaChart"
import {
  selectAlignedIndexes as indexSelector,
  selectVisiblePoints as emissionsSelector,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"
import TotalEmissionByTimeSection from "sections/charts/emissions/TotalEmissionByTimeSection"
import EmissionByTimeCompareToPreviousSection from "sections/charts/emissions/EmissionByTimeCompareToPreviousSection"
import EmissionByCategorySection from "../../components/natixarComponents/CO2DonutSection/EmissionByCategorySection"

// assets
import { ChartCard } from "../../components/natixarComponents/ChartCard/ChartCard"
import AcquisitionChart from "../../sections/dashboard/analytics/AcquisitionChart"
import DateFilter from "../../components/DateFilter"

// ==============================|| WIDGET - CHARTS ||============================== //

const NatixarChart = () => {
  const [areaSlot, setAreaSlot] = useState("month")
  const [acquisitionSlot, setAcquisitionSlot] = useState("month")
  const [compare, setCompare] = useState(false)

  const alignedIndexes = useSelector(indexSelector)
  const allPoints = useSelector(emissionsSelector)

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <DateFilter />
        </MainCard>
      </Grid> */}
      <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <Typography variant="h5" sx={{ marginBottom: "15px" }}>
            Scope Emissions
          </Typography>
          <EmissionByCategorySection
            allDataPoints={allPoints}
            alignedIndexes={alignedIndexes}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <TotalEmissionByTimeSection emissionPoints={allPoints} />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <EmissionByTimeCompareToPreviousSection emissionPoints={allPoints} />
      </Grid>
    </Grid>
  )
}

export default NatixarChart
