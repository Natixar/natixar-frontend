import { v4 as uuid } from "uuid"
import { TimeWindow } from "data/domain/types/time/TimeRelatedTypes"
import { CountryLocation } from "data/domain/types/participants/ContributorsTypes"
import { IndexesContainer } from "data/store/features/emissions/ranges/EndpointTypes"
import {
  AirEmissionMeasureUnits,
  AlignedIndexes,
  CdpLayoutItem,
  CompressedDataPoint,
  EmissionCategory,
  EmissionDataPoint,
  EmissionProtocol,
} from "../types/emissions/EmissionTypes"
import { detectCompany, detectCountry, detectScope } from "./DataDetectors"
import {
  getTimeDeltaForSlot,
  getTimeOffsetForSlot,
  slotsAreInSameYear,
} from "./TimeTransformers"
import { IndexOf } from "../types/structures/StructuralTypes"

const emptyDecimal = ".0"

const MEASURE_UNIT_GRADATION = 1000

export const formatAmount = (amount: number): string => {
  const addK = amount >= 1000
  let formattedAmount = (addK ? amount / 1000 : amount).toFixed(1)
  if (formattedAmount.endsWith(emptyDecimal)) {
    const index = formattedAmount.lastIndexOf(emptyDecimal)
    formattedAmount = formattedAmount.slice(0, index)
  }
  if (addK) formattedAmount += "k"
  return formattedAmount
}

export const formatEmissionAmount = (kgCO2eqAmount: number): string => {
  // The logic here is basically same for mg, g, kg, tons
  // Or milliseconds, seconds, minutes, hours and so on.
  // It's just the measurement unit are mass of emissions

  let measureUnitIndex = 0
  let amount = kgCO2eqAmount
  if (!amount) return `0.0 ${AirEmissionMeasureUnits.KG_CO2eq}`
  const measureUnits = Object.values(AirEmissionMeasureUnits)
  while (
    measureUnitIndex < measureUnits.length - 1 && // while we are in the array
    amount >= MEASURE_UNIT_GRADATION // We can pick a bigger measurement
  ) {
    amount /= MEASURE_UNIT_GRADATION
    measureUnitIndex += 1
  }

  let formattedAmount = amount.toFixed(1)
  if (formattedAmount.endsWith(emptyDecimal)) {
    // Remove .0, because we don't need it
    const index = formattedAmount.lastIndexOf(emptyDecimal)
    formattedAmount = formattedAmount.slice(0, index)
  }

  return `${formattedAmount} ${measureUnits[measureUnitIndex]}`
}

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

/* Calculate the total emission amount for a compressed data point
 * using the formula on page 10 of API Specification-Data Endpoint Rev. D */
const calculateTotalAmount = (
  dataPoint: CompressedDataPoint,
  timeWindow: TimeWindow,
): number => {
  const startTimeSlot = dataPoint[CdpLayoutItem.CDP_LAYOUT_START]
  const endTimeSlot = dataPoint[CdpLayoutItem.CDP_LAYOUT_END]

  const duration = dataPoint[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE] * getTimeDeltaForSlot(startTimeSlot, timeWindow) +
    dataPoint[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE] * getTimeDeltaForSlot(endTimeSlot - 1, timeWindow) +
    (getTimeOffsetForSlot(endTimeSlot - 1, timeWindow) - getTimeOffsetForSlot(startTimeSlot + 1, timeWindow))

  // The data point is in kgCO2eq/s so duration in ms must be divided by 1000
  return dataPoint[CdpLayoutItem.CDP_LAYOUT_INTENSITY] * duration / 1000
}

export const cdpToEdp = (
  cdp: CompressedDataPoint,
  indexes: IndexesContainer,
  alignedIndexes: AlignedIndexes,
  timeWindow: TimeWindow,
): EmissionDataPoint => {
  // The compressed data point indexes the arrays by position
  const categoryIndex = cdp[CdpLayoutItem.CDP_LAYOUT_CATEGORY]
  const category = indexes.category[categoryIndex]
  const categoryId = category.id
  const scope = detectScope(category, alignedIndexes)
  const origEra = category?.era ?? scope?.era ?? ""  // This fallback can only work with incorrect hierarchies
  const entityIndex = cdp[CdpLayoutItem.CDP_LAYOUT_ENTITY]
  const entityId = indexes.entity[entityIndex].id
  const company = detectCompany(entityId, alignedIndexes)

  const geoAreaIndex = cdp[CdpLayoutItem.CDP_LAYOUT_AREA]
  const geoAreaId = indexes.area[geoAreaIndex].id
  const geoArea = alignedIndexes.areas[geoAreaId]
  const country = detectCountry(geoAreaId, alignedIndexes)
  // BUG: Only Unit and Location have details with lat/long. Country does not.
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
    categoryName: category?.name ?? "Other",
    categoryEraName: extractNameOfEra(origEra),
    scopeName: scope.name,
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
    const categoryEra = emissionPoint.scopeName
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
  timeMeasureKeyFn: (timestamp: number, showYear: boolean) => string,
): Record<string, Record<string, number>> => {
  const result: Record<string, Record<string, number>> = {}
  const minTime = Math.min(...points.map((point) => point.startTimeSlot))
  const maxTime = Math.max(...points.map((point) => point.endTimeSlot))
  const showYear = !slotsAreInSameYear(minTime, maxTime, timeWindow)

  // Loop over all emission points defined in data/domain/types/emissions/EmissionTypes.ts#L9
  points.forEach((emissionPoint) => {
    const categoryEra = emissionPoint.categoryEraName
    // Initialize result for era if needed TODO: swap for category code
    if (!result[categoryEra]) {
      result[categoryEra] = {}
    }

    const totalTimeOffset = getTimeOffsetForSlot(
      emissionPoint.startTimeSlot,
      timeWindow,
    )
    const timeKey = timeMeasureKeyFn(
      timeWindow.startTimestamp + totalTimeOffset,
      showYear,
    )

    if (!result[categoryEra][timeKey]) {
      result[categoryEra][timeKey] = 0
    }

    result[categoryEra][timeKey] += emissionPoint.totalEmissionAmount
  })
  return result
}

export const getScopesOfProtocol = (
  protocol: EmissionProtocol,
  categoriesIndex: IndexOf<EmissionCategory>,
): EmissionCategory[] => {
  // Find scopes of the current protocol
  const categories = Object.values(categoriesIndex)
  const protocolId = categories.find(
    (category) => category.name.toLowerCase() === protocol.toLowerCase(),
  )?.id
  if (typeof protocolId === "undefined") {
    return []
  }
  const scopes = categories.filter((category) => protocolId === category.parent)
  return scopes
}
