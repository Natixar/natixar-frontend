import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import { EmissionDataPoint } from "data/domain/types/emissions/EmissionTypes"
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import useAsyncWork from "hooks/useAsyncWork"
import TotalEmissions from "../../../assets/images/chart-filter-images/Total-Emissions.png"

export interface TotalEmissionByTimeProps {
  emissionPoints: EmissionDataPoint[]
  unitLayout: Record<
    string,
    [
      (time: number, showYear?: boolean) => string,
      (timeStrA: string, timeStrB: string) => number,
    ]
  >
  thumbnail: string
  startDate: Date
  endDate: Date
  timeDetailUnit: string
  setTimeDetailUnit: (newSlot: string) => void
}

const TotalEmissionByTimeSection = ({
  emissionPoints,
  unitLayout,
  startDate,
  endDate,
  timeDetailUnit,
  setTimeDetailUnit,
}: TotalEmissionByTimeProps) => {
  const timeDetailSlots = useMemo(() => Object.keys(unitLayout), [unitLayout])
  const timeWindow = useSelector(timeWindowSelector)

  const [totalEmissions, setTotalEmissions] = useState("")
  useAsyncWork(
    () => {
      const sumEmission = emissionPoints.reduce(
        (acc, cur) => acc + cur.totalEmissionAmount,
        0,
      )
      return formatEmissionAmount(sumEmission)
    },
    setTotalEmissions,
    [emissionPoints],
  )

  const [timeFormatter, timeSorter] = unitLayout[timeDetailUnit]
  const [groupedByTime, setChartData] = useState<
    Record<string, Record<string, number>>
  >({})
  useAsyncWork(
    () => emissionsGroupByTime(emissionPoints, timeWindow, timeFormatter),
    setChartData,
    [emissionPoints, timeWindow, timeFormatter],
  )

  const allKeys = Array.from(
    new Set(
      Object.values(groupedByTime).flatMap((byKey) => Object.keys(byKey)),
    ),
  )
  allKeys.sort(timeSorter)

  return (
    <ChartCard
      title="Total Emissions"
      value={totalEmissions}
      startDate={startDate}
      endDate={endDate}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
      thumbnail={TotalEmissions}
      sectionId="section2"
    >
      <EmissionByKeyStacked groupedData={groupedByTime} keys={allKeys} />
    </ChartCard>
  )
}

export default TotalEmissionByTimeSection