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

  const [timeFormatter, timeSorter] = unitLayout[timeDetailUnit]
  const [datasetA, setDatasetA] = useState<
    Record<string, Record<string, number>>
  >({})
  const [datasetB, setDatasetB] = useState<
    Record<string, Record<string, number | undefined>>
  >({})

  useAsyncWork(
    () => emissionsGroupByTime(emissionPoints, timeWindow, timeFormatter),
    setDatasetA,
    [emissionPoints, timeWindow, timeFormatter],
  )

  useAsyncWork(
    () => {
      const emissionsDateTranslated: Record<
        string,
        Record<string, number | undefined>
      > = {}
      if (datasetA) {
        Object.keys(datasetA).map((key) => {
          emissionsDateTranslated[key] = {}
          Object.entries(datasetA[key]).map(
            ([depthKey, _value], index, array) => {
              let dateFormatted: string = (+depthKey - 1).toString()
              if (timeDetailUnit !== "Year") {
                const [datePrefix, year] = depthKey.split(" ")
                dateFormatted = datePrefix.concat(" ", (+year - 1).toString())
              }
              if (timeDetailUnit === "Day") {
                const [datePrefix, year] = depthKey.split(",")
                dateFormatted = datePrefix.concat(", ", (+year - 1).toString())
              }
              emissionsDateTranslated[key][depthKey] = array.find(
                ([keyFinder, _valueFinder]) => keyFinder === dateFormatted,
              )?.[1]
              return { [depthKey]: _value }
            },
          )
          return key
        })
      }
      return emissionsDateTranslated
    },
    setDatasetB,
    [emissionPoints, timeWindow, timeFormatter, datasetA],
  )

  useAsyncWork(
    () => {
      if (datasetA.Operation && datasetB.Operation) {
        const sumEmission = Object.entries(datasetA.Operation).reduce<number>(
          (a, [, c]) => a + c,
          0,
        )

        const sumEmissionB = Object.entries(datasetB.Operation).reduce<number>(
          (a, [, c]) => a + (c ?? 0),
          0,
        )

        const percentage = datasetB.Operation
          ? (100.0 * (1.0 * sumEmission - sumEmissionB)) / sumEmissionB
          : undefined
        const result: [string, number?] = [
          formatEmissionAmount(sumEmission),
          percentage,
        ]
        return result
      }
      return ["", 0] as [string, number?]
    },
    setEmissionData,
    [datasetA, datasetB],
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
