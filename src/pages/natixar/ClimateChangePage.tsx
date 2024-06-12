// material-ui
import { Grid } from "@mui/material"

// project import
import MainCard from "components/MainCard"

import {
  selectAlignedIndexes as indexSelector,
  selectVisiblePoints as emissionsSelector,
  selectTimeWindow,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
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
import { NatixarSectionTitle } from "components/natixarComponents/ChartCard/NatixarSectionTitle"
import { selectTimeMeasurement } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { TimeMeasurement } from "data/domain/types/time/TimeRelatedTypes"
import { useAppDispatch } from "data/store"
import EmissionByCategorySection from "../../components/natixarComponents/CO2DonutSection/EmissionByScopeDonutSection"

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

const mapTimeUnitimeMeasurement = (timeUnit: string): TimeMeasurement => {
  if (!(timeUnit in detailUnitLayout)) return TimeMeasurement.MONTHS

  if (timeUnit === "Hour") return TimeMeasurement.HOURS
  if (timeUnit === "Day") return TimeMeasurement.DAYS
  if (timeUnit === "Month") return TimeMeasurement.MONTHS
  if (timeUnit === "Quarter") return TimeMeasurement.QUARTERS
  if (timeUnit === "Year") return TimeMeasurement.YEARS
  return TimeMeasurement.MONTHS
}

const NatixarChart = () => {
  const [totalUnit, setTotalUnit] = useState("Month")
  const [comparisonUnit, setComparisonUnit] = useState("Month")

  const dispatch = useAppDispatch()
  const alignedIndexes = useSelector(indexSelector)
  const allPoints = useSelector(emissionsSelector)
  const timeWindow = useSelector(selectTimeWindow)

  let minTimeSlot = Math.min(...allPoints.map((point) => point.startTimeSlot))
  let maxTimeSlot = Math.max(...allPoints.map((point) => point.endTimeSlot))

  let minTime =  timeWindow.startTimestamp + getTimeOffsetForSlot(minTimeSlot, timeWindow)
  let maxTime =  timeWindow.startTimestamp + getTimeOffsetForSlot(maxTimeSlot, timeWindow)

  // above calculation may be out of bounds so take window directly
  minTime = timeWindow.startTimestamp
  maxTime = timeWindow.endTimestamp
  const minDate = new Date(minTime)
  const maxDate = new Date(maxTime)

  const onTotalEmissionUnitClick = useCallback(
    (timeUnit: string) => {
      setTotalUnit(timeUnit)
      const timeMeasurement = mapTimeUnitimeMeasurement(timeUnit)
      dispatch(selectTimeMeasurement(timeMeasurement))
    },
    [dispatch, selectTimeMeasurement],
  )

  const onTimeCompareEmissionUnitClick = useCallback(
    (timeUnit: string) => {
      setComparisonUnit(timeUnit)
      const timeMeasurement = mapTimeUnitimeMeasurement(timeUnit)
      dispatch(selectTimeMeasurement(timeMeasurement))
    },
    [dispatch, selectTimeMeasurement],
  )

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <NatixarSectionTitle>Scope Emissions</NatixarSectionTitle>
          <EmissionByCategorySection
            allDataPoints={allPoints}
            alignedIndexes={alignedIndexes}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <TotalEmissionByTimeSection
          emissionPoints={allPoints}
          unitLayout={detailUnitLayout}
          startDate={minDate}
          endDate={maxDate}
          timeDetailUnit={totalUnit}
          setTimeDetailUnit={onTotalEmissionUnitClick}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <EmissionByTimeCompareToPreviousSection
          emissionPoints={allPoints}
          unitLayout={detailUnitLayout}
          startDate={minDate}
          endDate={maxDate}
          timeDetailUnit={comparisonUnit}
          setTimeDetailUnit={onTimeCompareEmissionUnitClick}
        />
      </Grid>
    </Grid>
  )
}

export default NatixarChart
