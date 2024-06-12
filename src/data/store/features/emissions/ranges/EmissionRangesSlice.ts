import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  extractNameOfEra,
  dataPointsGroupByCompanyAndCategory,
  dataPointsGroupByCountryAndCategory,
  cdpToEdp,
} from "data/domain/transformers/EmissionTransformers"
import {
  AlignedIndexes,
  EmissionRangeState,
  EmissionFilterState,
  EmissionDataPoint,
  VisibleData,
  EmissionCategory,
  EmissionProtocol,
  CompressedDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import {
  IdTreeNode,
  IndexOf,
} from "data/domain/types/structures/StructuralTypes"
import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  TimeRange,
  TimeWindow,
  TimeMeasurement,
} from "data/domain/types/time/TimeRelatedTypes"
import {
  expandId,
  extractHierarchyOf,
} from "data/domain/transformers/StructuralTransformers"
import { getTimeRangeFor } from "data/domain/transformers/TimeTransformers"
import { EndpointTimeWindow, IndexesContainer } from "./EndpointTypes"
import { emissionRangesApi } from "./EmissionRangesClient"
import checkHTTPError from "utils/apiErrorChecker"

const initialFilterState: EmissionFilterState = {
  selectedBusinessEntities: [],
  selectedGeographicalAreas: [],
  selectedCategories: [],
}

const initialState: EmissionRangeState = {
  alignedIndexes: {
    entities: {},
    areas: {},
    categories: {},
    areaHierarchy: [],
    entityHierarchy: [],
    categoryHierarchy: [],
  },
  allPoints: [],
  visibleData: {
    emissionPoints: [],
    emissionsByCompany: {},
    emissionsByCountry: {},
  },
  overallTimeWindow: {
    startTimestamp: 0,
    endTimestamp: 0,
    timeStepInSecondsPattern: [],
    timeOffsets: [],
  },
  emissionFilterState: { ...initialFilterState },
  dataRetrievalParameters: {
    timeRangeOfInterest: getTimeRangeFor(12),
    protocol: EmissionProtocol.BEGES,
    timeMeasurement: TimeMeasurement.MONTHS,
  },
}

const extractAreaHierarchy = (areas: IndexOf<GeographicalArea>): IdTreeNode[] =>
  extractHierarchyOf(
    areas,
    (area) => area.id,
    (area) => area.parent,
  )

const extractEntityHierarchy = (
  entities: IndexOf<BusinessEntity>,
): IdTreeNode[] =>
  extractHierarchyOf(
    entities,
    (entity) => entity.id,
    (entity) => entity.parent,
  )

const extractCategoryHierarchy = (
  categories: IndexOf<EmissionCategory>,
): IdTreeNode[] =>
  extractHierarchyOf(
    categories,
    (category) => category.id,
    (category) => category.parent,
  )

const alignIndexes = (originalIndexes: IndexesContainer): AlignedIndexes => {
  const alignedBusinessEntities = Object.fromEntries(
    originalIndexes.entity.map((company) => [company.id, company]),
  )
  const alignedAreas = Object.fromEntries(
    originalIndexes.area.map((area) => [area.id, area]),
  )

  const alignedCategories = Object.fromEntries(
    originalIndexes.category
      .map((origCategory) => ({
        ...origCategory,
        era: extractNameOfEra(origCategory.era),
      }))
      .map((category) => [category.id, category]),
  )

  const areasTree = extractAreaHierarchy(alignedAreas)
  const entityTree = extractEntityHierarchy(alignedBusinessEntities)
  const categoryTree = extractCategoryHierarchy(alignedCategories)

  return {
    entities: alignedBusinessEntities,
    areas: alignedAreas,
    categories: alignedCategories,
    areaHierarchy: areasTree,
    entityHierarchy: entityTree,
    categoryHierarchy: categoryTree,
  }
}

function filterRoutine<T>(currentValue: T, filterSelectedValues: T[]): boolean {
  return (
    filterSelectedValues.length === 0 ||
    filterSelectedValues.includes(currentValue)
  )
}

const extractVisibleData = (
  dataPoints: EmissionDataPoint[],
  indexes: AlignedIndexes,
  filter: EmissionFilterState,
): VisibleData => {
  let filteredDataPoints = dataPoints
  if (filter.selectedCategories.length > 0) {
    filteredDataPoints = filteredDataPoints
      .filter((dataPoint) => dataPoint.categoryEraName !== "")
      .filter((dataPoint) => {
        const era = dataPoint.categoryEraName
        return filterRoutine(
          era.toLowerCase(),
          filter.selectedCategories.map((category) => category.toLowerCase()),
        )
      })
  }
  if (filter.selectedBusinessEntities.length > 0) {
    const expandedEntityIds = expandId(
      filter.selectedBusinessEntities,
      indexes.entityHierarchy,
    )

    filteredDataPoints = filteredDataPoints.filter((dataPoint) =>
      filterRoutine(dataPoint.entityId, expandedEntityIds),
    )
  }

  if (filter.selectedGeographicalAreas.length > 0) {
    const expandedGeoAreaIds = expandId(
      filter.selectedGeographicalAreas,
      indexes.areaHierarchy,
    )

    filteredDataPoints = filteredDataPoints.filter((dataPoint) =>
      filterRoutine(dataPoint.geoAreaId, expandedGeoAreaIds),
    )
  }

  return {
    emissionPoints: [...filteredDataPoints],
    emissionsByCompany: dataPointsGroupByCompanyAndCategory(filteredDataPoints),
    emissionsByCountry: dataPointsGroupByCountryAndCategory(filteredDataPoints),
  }
}

/* Compute the timestamps at the beginning of each time slot, plus the endTimestamp to finish the last slot. */
const computeTimeOffset = (startTimestamp: number, endTimestamp: number, timeStepInSecondsPattern: number[]): number[] => {
  const timeOffsets: number[] = [];
  const n: number = timeStepInSecondsPattern.length;

  // Compute time offsets for each pattern step in milliseconds
  let sum = 0   // first value pushed
  let index = 0

  do {
    timeOffsets.push(sum)
    sum += timeStepInSecondsPattern[index % n] * 1000
    index++
  } while (startTimestamp + sum < endTimestamp)

  timeOffsets.push(endTimestamp - startTimestamp) // last value pushed

  return timeOffsets
}

/* Fills the TimeWindow structure based on API endpoint response. */
const extractTimeWindow = (endpointTW: EndpointTimeWindow): TimeWindow => {
  const startTimestamp = new Date(endpointTW.start).getTime(); // Convert start time once
  const endTimestamp = new Date(endpointTW.end).getTime();     // Convert end time once
  const pattern = Array.isArray(endpointTW.step) ? endpointTW.step : [endpointTW.step]

  return {
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    timeStepInSecondsPattern: pattern,
    timeOffsets: computeTimeOffset(startTimestamp, endTimestamp, pattern)
  }
}

const setSelectedBusinessEntitiesReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<number[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedBusinessEntities: action.payload,
  }
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = { ...newVisibleData }
}

const setSelectedGeoAreasReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<number[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedGeographicalAreas: action.payload,
  }
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = { ...newVisibleData }
}

const setSelectedCategoriesReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<string[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedCategories: action.payload,
  }
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = { ...newVisibleData }
}

const setNewFilterReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<EmissionFilterState>
> = (state, action) => {
  state.emissionFilterState = { ...action.payload }
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = { ...newVisibleData }
}

const clearFilterSelectionsReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction
> = (state) => {
  state.emissionFilterState = { ...initialFilterState }
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = { ...newVisibleData }
}

const selectTimeRangeReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<TimeRange>
> = (state, action) => {
  state.dataRetrievalParameters.timeRangeOfInterest = action.payload
}

const selectProtocolReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<EmissionProtocol>
> = (state, action) => {
  state.dataRetrievalParameters.protocol = action.payload
}

const selectTimeMeasurementReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<TimeMeasurement>
> = (state, action) => {
  state.dataRetrievalParameters.timeMeasurement = action.payload
}

export const emissionsRangeSlice = createSlice({
  name: "emissionRanges",
  initialState,
  reducers: {
    selectBusinessEntities: setSelectedBusinessEntitiesReducer,
    selectGeoAreas: setSelectedGeoAreasReducer,
    selectCategories: setSelectedCategoriesReducer,
    updateFilterSelection: setNewFilterReducer,
    selectTimeRange: selectTimeRangeReducer,
    selectProtocol: selectProtocolReducer,
    selectTimeMeasurement: selectTimeMeasurementReducer,
    clearFilterSelection: clearFilterSelectionsReducer,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      emissionRangesApi.endpoints.getEmissionRanges.matchFulfilled,
      (state, action) => {
        checkHTTPError(state, action, () => {
          const emissions = action.payload.data[0]
          const alignedIndexes = alignIndexes(emissions.indexes)
          const timeWindow = extractTimeWindow(emissions.time_range)
          const allPoints = emissions.data.map((cdp: CompressedDataPoint) =>
            cdpToEdp(cdp, emissions.indexes, alignedIndexes, timeWindow),
          )
          // const availableFilters = extractFilters(alignedIndexes)
          const visibleData = extractVisibleData(
            allPoints,
            alignedIndexes,
            state.emissionFilterState,
          )

          state.alignedIndexes = alignedIndexes
          state.allPoints = allPoints
          state.visibleData = visibleData
          state.overallTimeWindow = timeWindow
          // state.emissionFilterState = availableFilters
        })
      },
    )
  },
})

export const {
  selectBusinessEntities,
  selectGeoAreas,
  selectCategories,
  updateFilterSelection,
  clearFilterSelection,
  selectTimeRange,
  selectProtocol,
  selectTimeMeasurement,
} = emissionsRangeSlice.actions
export default emissionsRangeSlice.reducer
