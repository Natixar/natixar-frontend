import { RootState } from "data/store"

export const selectGlobalFilter = (state: RootState) =>
  state.emissionRanges.globalFilter

export const selectAllVisibleCategories = (state: RootState) =>
  state.emissionRanges.globalFilter.availableValues.categories

export const selectVisibleData = (state: RootState) =>
  state.emissionRanges.visibleFrame.allPoints

export const selectCoordinatesByCompany = (state: RootState) =>
  state.emissionRanges.visibleFrame.byCompany

export const selectCoordinatesByCountry = (state: RootState) =>
  state.emissionRanges.visibleFrame.byCountry

export const selectSelectedCluster = (state: RootState) => state.selectedCluster

export const selectAlignedIndexes = (state: RootState) =>
  state.emissionRanges.alignedIndexes
