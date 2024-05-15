// material-ui
import { Box, Grid } from "@mui/material"

// project import
import MainCard from "components/MainCard"
import IconButton from "components/@extended/IconButton"
import { v4 as uuidv4 } from "uuid"

// assets
import { PlusCircleOutlined } from "@ant-design/icons"

import {
  selectAlignedIndexes as indexSelector,
  selectVisiblePoints as emissionsSelector,
  selectTimeWindow,
} from "data/store/api/EmissionSelectors"
import { useDispatch, useSelector } from "react-redux"
import EmissionByTimeCompareToPreviousSection from "sections/charts/emissions/EmissionByTimeCompareToPreviousSection"
import TotalEmissionByTimeSection from "sections/charts/emissions/TotalEmissionByTimeSection"
import {
  getTimeOffsetForSlot,
  sortDays,
  sortHours,
  sortMonths,
  sortQuarters,
  timestampToDay,
  timestampToHour,
  timestampToMonth,
  timestampToQuarter,
  timestampToYear,
} from "data/domain/transformers/TimeTransformers"
import _ from "lodash"
import { useCallback, useState } from "react"
import { NatixarSectionTitle } from "../../components/natixarComponents/ChartCard/NatixarSectionTitle"
import { RootState } from "data/store"
import { updateChartFilter } from "data/store/features/chartFilter/ChartFilterSlice"
import { ChartFilterState } from "data/store/features/chartFilter/Types"
import EmissionByCategorySection from "../../components/natixarComponents/CO2DonutSection/EmissionByScopeDonutSection"

import ScopeEmissions from "../../assets/images/chart-filter-images/Scope Emissions.png"
import TrendStacked from "../../assets/images/chart-filter-images/Scope Emissions.png"
// ==============================|| WIDGET - CHARTS ||============================== //

const detailUnitLayout: Record<
  string,
  [
    (time: number, showYear?: boolean) => string,
    (timeStrA: string, timeStrB: string) => number,
  ]
> = {
  Hour: [timestampToHour, sortHours],
  Day: [timestampToDay, sortDays],
  Month: [timestampToMonth, sortMonths],
  Quarter: [timestampToQuarter, sortQuarters],
  Year: [timestampToYear, (a, b) => a.localeCompare(b)],
}

const NatixarChart = () => {
  const { chartFilterState } = useSelector(
    (state: RootState) => state.chartFilterState,
  )
  const dispatch = useDispatch()
  const [totalUnit, setTotalUnit] = useState("Month")
  const [comparisonUnit, setComparisonUnit] = useState("Month")

  const alignedIndexes = useSelector(indexSelector)
  const allPoints = useSelector(emissionsSelector)
  const timeWindow = useSelector(selectTimeWindow)

  let minTime =
    _.minBy(allPoints, (point) => point.startTimeSlot)?.startTimeSlot ?? 0
  minTime =
    timeWindow.startTimestamp + getTimeOffsetForSlot(minTime, timeWindow)
  let maxTime =
    _.maxBy(allPoints, (point) => point.endTimeSlot)?.endTimeSlot ?? 0
  maxTime =
    timeWindow.startTimestamp + getTimeOffsetForSlot(maxTime, timeWindow)

  const minDate = new Date(minTime)
  const maxDate = new Date(maxTime)

  const handleAddChartToReport = useCallback(
    (name: string, min: Date, max: Date, src: string, scrollId : string) => {
      const chartFilter: ChartFilterState = [
        ...chartFilterState,
        { id: uuidv4(), name, minDate: min, maxDate: max, src, scrollId },
      ]
      dispatch(updateChartFilter(chartFilter))
    },
    [chartFilterState],
  )

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <Box display="flex" id="section1">
            <NatixarSectionTitle>Scope Emissions</NatixarSectionTitle>
            <IconButton
              sx={{ ml: 1 }}
              disabled={chartFilterState.some(
                (chart: any) => chart.name === "Scope Emissions",
              )}
              onClick={() =>
                handleAddChartToReport(
                  "Scope Emissions",
                  minDate,
                  maxDate,
                  ScopeEmissions,
                  "section1",
                )
              }
            >
              <PlusCircleOutlined />
            </IconButton>
          </Box>
          <EmissionByCategorySection
            allDataPoints={allPoints}
            alignedIndexes={alignedIndexes}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={12} lg={12} id="Total Emissions">
        <TotalEmissionByTimeSection
          emissionPoints={allPoints}
          unitLayout={detailUnitLayout}
          startDate={minDate}
          endDate={maxDate}
          timeDetailUnit={totalUnit}
          setTimeDetailUnit={setTotalUnit}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12} id="Total Emissions">
        <EmissionByTimeCompareToPreviousSection
          emissionPoints={allPoints}
          unitLayout={detailUnitLayout}
          startDate={minDate}
          endDate={maxDate}
          timeDetailUnit={comparisonUnit}
          setTimeDetailUnit={setComparisonUnit}
        />
      </Grid>
    </Grid>
  )
}

export default NatixarChart
