import { useMemo, useState } from "react"

import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import EmissionByKeyComparison from "components/charts/emissions/EmissionByKeyComparison"
import useAsyncWork from "hooks/useAsyncWork"
import { TotalEmissionByTimeProps } from "./TotalEmissionByTimeSection"
import StackedBarsCO2 from "../../../assets/images/chart-filter-images/stackedBarsCO2.png"

const EmissionByTimeCompareToPreviousSection = ({
  emissionPoints,
  unitLayout,
  startDate,
  endDate,
  timeDetailUnit,
  setTimeDetailUnit,
}: TotalEmissionByTimeProps) => {
  const timeDetailSlots = useMemo(() => Object.keys(unitLayout), [unitLayout])
  const timeWindow = useSelector(timeWindowSelector)
  const [emissionData, setEmissionData] = useState<[string, number?]>([
    "",
    undefined,
  ])
  const [showComparison, setShowComparison] = useState(false)
  const emissionPointsB = useMemo(
    () =>
      emissionPoints.map((ep) => {
        const coef = Math.random()
        return {
          ...ep,
          emissionIntensity: coef * ep.emissionIntensity,
          totalEmissionAmount: coef * ep.totalEmissionAmount,
        }
      }),
    [emissionPoints],
  )

  useAsyncWork(
    () => {
      const sumEmission = emissionPoints.reduce(
        (acc, cur) => acc + cur.totalEmissionAmount,
        0,
      )

      const sumEmissionB =
        emissionPointsB?.reduce(
          (acc, cur) => acc + cur.totalEmissionAmount,
          0,
        ) ?? 0

      const percentage = emissionPointsB
        ? (100.0 * (1.0 * sumEmission - sumEmissionB)) / sumEmissionB
        : undefined
      const result: [string, number?] = [
        formatEmissionAmount(sumEmission),
        percentage,
      ]
      return result
    },
    setEmissionData,
    [emissionPoints, emissionPointsB],
  )

  const [timeFormatter, timeSorter] = unitLayout[timeDetailUnit]
  const [datasetA, setDatasetA] = useState<
    Record<string, Record<string, number>>
  >({})
  const [datasetB, setDatasetB] = useState<
    Record<string, Record<string, number>>
  >({})

  useAsyncWork(
    () => emissionsGroupByTime(emissionPoints, timeWindow, timeFormatter),
    setDatasetA,
    [emissionPoints, timeWindow, timeFormatter],
  )
  useAsyncWork(
    () => emissionsGroupByTime(emissionPointsB, timeWindow, timeFormatter),
    setDatasetB,
    [emissionPointsB, timeWindow, timeFormatter],
  )

  const allKeys = useMemo(() => {
    const keys = Array.from(
      new Set(Object.values(datasetA).flatMap((byKey) => Object.keys(byKey))),
    )
    keys.sort(timeSorter)
    return keys
  }, [datasetA, timeSorter])

  const [totalEmissions, differencePercentage] = emissionData

  return (
    <ChartCard
      title="Trend stacked bars CO2"
      value={totalEmissions}
      startDate={startDate}
      endDate={endDate}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
      percentage={differencePercentage}
      showCompareButton
      compare={showComparison}
      setCompare={setShowComparison}
      thumbnail={StackedBarsCO2}
      sectionId="section3"
    >
      <EmissionByKeyComparison
        dataSetA={datasetA}
        dataSetB={showComparison ? datasetB : undefined}
        keys={allKeys}
      />
    </ChartCard>
  )
}

export default EmissionByTimeCompareToPreviousSection
