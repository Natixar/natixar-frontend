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
import { useEffect, useState } from "react"
import EmissionByCategorySection from "../../components/natixarComponents/CO2DonutSection/EmissionByScopeDonutSection"
import { NatixarSectionTitle } from "components/natixarComponents/ChartCard/NatixarSectionTitle"
import useConfig from "hooks/useConfig"

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

  const { setIsShowExtraHeader } = useConfig()

  useEffect(() => {
    setIsShowExtraHeader(false)
  }, [])

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
          setTimeDetailUnit={setTotalUnit}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
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
