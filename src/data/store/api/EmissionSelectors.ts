import {
  AlignedIndexes,
  EmissionCategory,
  EmissionDataPoint,
  EmissionFilterState,
  EmissionProtocol,
  EmissionRetrievalParametersState,
} from "data/domain/types/emissions/EmissionTypes"
import { IndexOf } from "data/domain/types/structures/StructuralTypes"
import { TimeWindow } from "data/domain/types/time/TimeRelatedTypes"
import { RootState } from "data/store"

export const selectEmissionFilter = (state: RootState): EmissionFilterState =>
  state.emissionRanges.emissionFilterState

export const selectTimeWindow = (state: RootState): TimeWindow =>
  state.emissionRanges.overallTimeWindow

export const selectEmissionRangeRequestParameters = (
  state: RootState,
): EmissionRetrievalParametersState =>
  state.emissionRanges.dataRetrievalParameters

export const selectRequestTimeRange = (state: RootState) =>
  selectEmissionRangeRequestParameters(state).timeRangeOfInterest

export const selectRequestEmissionProtocol = (
  state: RootState,
): EmissionProtocol => selectEmissionRangeRequestParameters(state).protocol

export const selectAlignedIndexes = (state: RootState): AlignedIndexes =>
  state.emissionRanges.alignedIndexes

export const selectAllVisibleCategories = (
  state: RootState,
): IndexOf<EmissionCategory> => selectAlignedIndexes(state).categories

export const selectAllVisibleCategoryEras = (state: RootState) => {
  const allCategories = Object.values(selectAllVisibleCategories(state))
  const allCategoryNames: string[] = allCategories
    .map((category) => category.era ?? "")
    .filter((era) => era !== "")
  return [...new Set<string>(allCategoryNames)]
}

export const selectVisiblePoints = (state: RootState): EmissionDataPoint[] =>
  state.emissionRanges.visibleData.emissionPoints

export const selectAllPoints = (state: RootState): EmissionDataPoint[] =>
  state.emissionRanges.allPoints

export const selectVisibleEmissionsByCompany = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCompany

export const selectCoordinatesByCountry = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCountry

export const areaChartSelector = (state: RootState) =>
  state.emissionRanges.areaChartState

export const barChartSelector = (state: RootState) =>
  state.emissionRanges.barChartState

export const donutChartSelector = (state: RootState) =>
  state.emissionRanges.donutChartState
