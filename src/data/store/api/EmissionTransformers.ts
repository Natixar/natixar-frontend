import { v4 as uuid } from "uuid"
import {
  AlignedIndexes,
  CdpLayoutItem,
  CompressedDataPoint,
  CountryLocation,
  EmissionDataPoint,
  TimeWindow,
} from "../features/emissions/ranges/EmissionTypes"
import { detectCompany, detectCountry } from "./DataDetectors"

export const extractNameOfEra = (era: string | undefined) => {
  if (typeof era === "undefined") {
    return ""
  }
  switch (era.toLowerCase()) {
    case "d":
      return "Downstream"
    case "u":
      return "Upstream"
    case "o":
      return "Operation"
    default:
      return era
  }
}

const getTimeOffsetForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => {
  const n = timeWindow.timeStepInSecondsPattern.length
  if (n === 0) {
    return 0
  }
  return timeWindow.timeStepInSecondsPattern[slotNumber % n]
}

const calculateTotalAmount = (
  dataPoint: CompressedDataPoint,
  timeWindow: TimeWindow,
): number => {
  // TODO more accurate step usage
  const duration =
    timeWindow.timeStepInSecondsPattern[0] *
    (dataPoint[CdpLayoutItem.CDP_LAYOUT_END] -
      dataPoint[CdpLayoutItem.CDP_LAYOUT_START] -
      2 +
      dataPoint[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE] +
      dataPoint[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE])

  return duration * dataPoint[CdpLayoutItem.CDP_LAYOUT_INTENSITY]
}

export const cdpToEdp = (
  cdp: CompressedDataPoint,
  indexes: AlignedIndexes,
  timeWindow: TimeWindow,
): EmissionDataPoint => {
  const categoryId = cdp[CdpLayoutItem.CDP_LAYOUT_CATEGORY]
  const origEra = indexes.categories[categoryId]?.era
  const entityId = cdp[CdpLayoutItem.CDP_LAYOUT_ENTITY]
  const company = detectCompany(entityId, indexes)

  const geoAreaId = cdp[CdpLayoutItem.CDP_LAYOUT_AREA]
  const geoArea = indexes.areas[geoAreaId]
  const country = detectCountry(geoAreaId, indexes)
  const countryLocation: CountryLocation = {
    lat: country.details?.lat ?? geoArea.details?.lat ?? 0,
    lon: country.details?.long ?? geoArea.details?.long ?? 0,
    country: country.name,
  }

  const totalAmount = calculateTotalAmount(cdp, timeWindow)

  return {
    id: uuid(),
    totalEmissionAmount: totalAmount,
    categoryId,
    categoryEraName: extractNameOfEra(origEra),
    entityId,
    companyId: company.id,
    companyName: company.name,
    geoAreaId,
    countryId: country.id,
    location: countryLocation,

    startTimeSlot: cdp[CdpLayoutItem.CDP_LAYOUT_START],
    startEmissionPercentage: cdp[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE],
    endTimeSlot: cdp[CdpLayoutItem.CDP_LAYOUT_END],
    endEmissionPercentage: cdp[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE],
    emissionIntensity: cdp[CdpLayoutItem.CDP_LAYOUT_INTENSITY],
  }
}

export const dataPointsGroupBySomeIdAndCategory = (
  points: EmissionDataPoint[],
  groupKeyFunc: (dataPoint: EmissionDataPoint) => number,
): Record<string, Record<number, number>> => {
  const result: Record<string, Record<number, number>> = {}
  points.forEach((emissionPoint) => {
    const categoryEra = emissionPoint.categoryEraName
    if (typeof result[categoryEra] === "undefined") {
      result[categoryEra] = {}
    }
    const byCategory = result[categoryEra]

    const groupKey = groupKeyFunc(emissionPoint)
    if (!byCategory[groupKey]) {
      byCategory[groupKey] = 0
    }
    byCategory[groupKey] += emissionPoint.totalEmissionAmount
  })

  return result
}

export const dataPointsGroupByCompanyAndCategory = (
  points: EmissionDataPoint[],
) => dataPointsGroupBySomeIdAndCategory(points, (point) => point.companyId)

export const dataPointsGroupByCountryAndCategory = (
  points: EmissionDataPoint[],
) => dataPointsGroupBySomeIdAndCategory(points, (point) => point.countryId)

export const emissionsGroupByTime = (
  points: EmissionDataPoint[],
  timeWindow: TimeWindow,
  timeMeasureKeyFn: (timestamp: number) => string,
): Record<string, Record<string, number>> => {
  const result: Record<string, Record<string, number>> = {}

  points.forEach((emissionPoint) => {
    const categoryEra = emissionPoint.categoryEraName
    if (typeof result[categoryEra] === "undefined") {
      result[categoryEra] = {}
    }
    const byCategory = result[categoryEra]

    let currentTimeSlot = emissionPoint.startTimeSlot
    let totalTimeOffset: number = 0
    do {
      const timeKey = timeMeasureKeyFn(
        timeWindow.startTimestamp + totalTimeOffset,
      )
      const currentSlotOffset = getTimeOffsetForSlot(
        currentTimeSlot,
        timeWindow,
      )

      if (!byCategory[timeKey]) {
        byCategory[timeKey] = 0
      }

      let amount = emissionPoint.emissionIntensity * currentSlotOffset
      switch (currentTimeSlot) {
        case emissionPoint.startTimeSlot:
          amount *= emissionPoint.startEmissionPercentage
          break
        case emissionPoint.endTimeSlot:
          amount *= emissionPoint.endEmissionPercentage
          break
        default:
          break
      }
      byCategory[timeKey] = amount

      totalTimeOffset += getTimeOffsetForSlot(currentTimeSlot, timeWindow)
      currentTimeSlot += 1
    } while (currentTimeSlot <= emissionPoint.endTimeSlot)
  })

  return result
}
